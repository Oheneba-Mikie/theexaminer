import { Question, Exam, Submission } from "@/types/exam";
import { supabaseService } from "./supabaseService";

/**
 * Configuration for the Deepseek AI service
 */
interface DeepseekConfig {
  apiKey: string;
  endpoint: string;
  model: string;
}

/**
 * Response from the Deepseek AI service
 */
interface DeepseekResponse {
  questions: Question[];
  error?: string;
}

/**
 * API Response interfaces
 */
interface ApiResponse<T> {
  data?: T;
  error?: string;
}

/**
 * Deepseek API response structure
 */
interface DeepseekApiResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Default configuration for the Deepseek AI service
 */
const defaultConfig: DeepseekConfig = {
  apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || "",
  endpoint: "https://api.deepseek.com/v1/chat/completions",
  model: "deepseek-chat",
};

// Log the API key presence for debugging (not the actual key)
console.log(
  "Deepseek API key configured:",
  !!import.meta.env.VITE_DEEPSEEK_API_KEY,
  "Value length:",
  import.meta.env.VITE_DEEPSEEK_API_KEY
    ? import.meta.env.VITE_DEEPSEEK_API_KEY.length
    : 0,
);

/**
 * Service for interacting with the Deepseek AI API and managing exam data
 */
export const aiService = {
  /**
   * Extract questions from a PDF file using the Deepseek AI service
   * @param file The PDF file to extract questions from
   * @param config Optional configuration for the Deepseek AI service
   * @returns A promise that resolves to the extracted questions
   */
  async extractQuestionsFromPDF(
    file: File,
    config: Partial<DeepseekConfig> = {},
  ): Promise<DeepseekResponse> {
    // Combine default config with provided config
    const fullConfig = { ...defaultConfig, ...config };

    try {
      // Check if API key is available
      if (!fullConfig.apiKey || fullConfig.apiKey.trim() === "") {
        console.error("Deepseek API key is missing in environment variables");
        console.error(
          "Environment variable exists:",
          import.meta.env.hasOwnProperty("VITE_DEEPSEEK_API_KEY"),
        );
        throw new Error("Deepseek API key is not configured");
      }

      console.log(
        "Using Deepseek API with configured key (length: " +
          fullConfig.apiKey.length +
          ")",
      );

      // Convert PDF to base64
      const base64 = await this.fileToBase64(file);

      // Create prompt for Deepseek API
      const prompt = `
        I have a PDF of a multiple choice exam. I've converted it to base64 format: ${base64.substring(0, 1000)}...[truncated]
        
        Please extract all multiple choice questions from this PDF and format them as a JSON array of questions.
        Each question should have the following structure:
        {
          "id": "unique_id",
          "text": "question text",
          "options": [
            { "id": "a", "text": "option text" },
            { "id": "b", "text": "option text" },
            ...
          ],
          "correctOptionId": "correct_option_id"
        }
        
        Return ONLY the JSON array without any additional text or explanation.
      `;

      // Make API call to Deepseek
      const response = await fetch(fullConfig.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${fullConfig.apiKey}`,
        },
        body: JSON.stringify({
          model: fullConfig.model,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.2, // Lower temperature for more deterministic output
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Deepseek API error: ${errorData.error?.message || response.statusText}`,
        );
      }

      const data: DeepseekApiResponse = await response.json();

      // Extract the JSON string from the response
      const jsonContent = data.choices[0]?.message.content;
      if (!jsonContent) {
        throw new Error("No content returned from Deepseek API");
      }

      // Parse the JSON string to get the questions
      try {
        // Find JSON array in the response (it might be surrounded by markdown code blocks or other text)
        const jsonMatch = jsonContent.match(/\[\s*\{.*\}\s*\]/s);
        if (!jsonMatch) {
          throw new Error("Could not find valid JSON in the response");
        }

        const questions = JSON.parse(jsonMatch[0]) as Question[];
        return { questions };
      } catch (parseError) {
        console.error("Error parsing JSON from Deepseek response:", parseError);
        throw new Error("Failed to parse questions from Deepseek response");
      }
    } catch (error) {
      console.error("Error extracting questions from PDF:", error);
      return {
        questions: [],
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  /**
   * Convert a file to base64 string
   * @param file The file to convert
   * @returns A promise that resolves to the base64 string
   */
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
          const base64 = reader.result.split(",")[1];
          resolve(base64);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  },

  /**
   * Create a new exam with questions
   * @param exam The exam data to create
   * @returns A promise that resolves to the created exam
   */
  async createExam(
    exam: Omit<Exam, "id" | "createdAt">,
  ): Promise<ApiResponse<Exam>> {
    try {
      console.log("Creating exam:", exam);

      // Use the supabaseService to create the exam in the database
      const { data, error } = await supabaseService.createExam(exam);

      if (error) {
        throw new Error(error);
      }

      return { data };
    } catch (error) {
      console.error("Error creating exam:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  /**
   * Get all exams
   * @returns A promise that resolves to an array of exams
   */
  async getExams(): Promise<ApiResponse<Exam[]>> {
    try {
      console.log("Fetching all exams");

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock response with sample exams
      const exams: Exam[] = [
        {
          id: "1",
          title: "Midterm Exam - Biology 101",
          createdAt: "2023-05-15",
          questions: [],
          status: "active",
          url: "https://example.com/exam/bio101",
          submissions: 42,
        },
        {
          id: "2",
          title: "Final Exam - Chemistry 202",
          createdAt: "2023-06-01",
          questions: [],
          status: "active",
          url: "https://example.com/exam/chem202",
          submissions: 38,
        },
      ];

      return { data: exams };
    } catch (error) {
      console.error("Error fetching exams:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  /**
   * Get an exam by ID
   * @param examId The ID of the exam to get
   * @returns A promise that resolves to the exam
   */
  async getExamById(examId: string): Promise<ApiResponse<Exam>> {
    try {
      console.log("Fetching exam by ID:", examId);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock response with sample exam
      const exam: Exam = {
        id: examId,
        title: "Midterm Exam - Biology 101",
        createdAt: "2023-05-15",
        questions: [
          {
            id: "1",
            text: "What is the powerhouse of the cell?",
            options: [
              { id: "a", text: "Nucleus" },
              { id: "b", text: "Mitochondria" },
              { id: "c", text: "Endoplasmic Reticulum" },
              { id: "d", text: "Golgi Apparatus" },
            ],
            correctOptionId: "b",
          },
          {
            id: "2",
            text: "Which of the following is NOT a state of matter?",
            options: [
              { id: "a", text: "Solid" },
              { id: "b", text: "Liquid" },
              { id: "c", text: "Gas" },
              { id: "d", text: "Energy" },
            ],
            correctOptionId: "d",
          },
        ],
        status: "active",
        url: `https://example.com/exam/${examId}`,
        submissions: 42,
      };

      return { data: exam };
    } catch (error) {
      console.error("Error fetching exam:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  /**
   * Update an exam
   * @param examId The ID of the exam to update
   * @param examData The updated exam data
   * @returns A promise that resolves to the updated exam
   */
  async updateExam(
    examId: string,
    examData: Partial<Exam>,
  ): Promise<ApiResponse<Exam>> {
    try {
      console.log("Updating exam:", examId, examData);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock response with updated exam
      const updatedExam: Exam = {
        id: examId,
        title: examData.title || "Updated Exam",
        createdAt: "2023-05-15",
        questions: examData.questions || [],
        status: examData.status || "draft",
        url: `https://example.com/exam/${examId}`,
        submissions: examData.submissions || 0,
      };

      return { data: updatedExam };
    } catch (error) {
      console.error("Error updating exam:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  /**
   * Delete an exam
   * @param examId The ID of the exam to delete
   * @returns A promise that resolves to a success message
   */
  async deleteExam(examId: string): Promise<ApiResponse<{ success: boolean }>> {
    try {
      console.log("Deleting exam:", examId);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return { data: { success: true } };
    } catch (error) {
      console.error("Error deleting exam:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  /**
   * Get all submissions for an exam
   * @param examId The ID of the exam to get submissions for
   * @returns A promise that resolves to an array of submissions
   */
  async getSubmissions(examId: string): Promise<ApiResponse<Submission[]>> {
    try {
      console.log("Fetching submissions for exam:", examId);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock response with sample submissions
      const submissions: Submission[] = [
        {
          id: "1",
          studentName: "John Doe",
          studentId: "S12345",
          examId: examId,
          examTitle: "Midterm Exam - Biology 101",
          submittedAt: "2023-05-20 14:30",
          answers: { "1": "b", "2": "d" },
          score: 2,
          totalQuestions: 2,
        },
        {
          id: "2",
          studentName: "Jane Smith",
          studentId: "S12346",
          examId: examId,
          examTitle: "Midterm Exam - Biology 101",
          submittedAt: "2023-05-20 15:15",
          answers: { "1": "b", "2": "c" },
          score: 1,
          totalQuestions: 2,
        },
      ];

      return { data: submissions };
    } catch (error) {
      console.error("Error fetching submissions:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  /**
   * Submit an exam
   * @param submission The submission data
   * @returns A promise that resolves to the created submission with score
   */
  async submitExam(
    submission: Omit<Submission, "id" | "submittedAt" | "score">,
  ): Promise<ApiResponse<Submission>> {
    try {
      console.log("Submitting exam:", submission);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get the exam to calculate the score
      const examResponse = await this.getExamById(submission.examId);
      if (examResponse.error || !examResponse.data) {
        return { error: "Failed to retrieve exam for scoring" };
      }

      // Calculate the score
      const exam = examResponse.data;
      let score = 0;
      Object.entries(submission.answers).forEach(([questionId, answerId]) => {
        const question = exam.questions.find((q) => q.id === questionId);
        if (question && question.correctOptionId === answerId) {
          score++;
        }
      });

      // Mock response with created submission
      const createdSubmission: Submission = {
        ...submission,
        id: `submission-${Date.now()}`,
        submittedAt: new Date().toISOString(),
        score,
      };

      return { data: createdSubmission };
    } catch (error) {
      console.error("Error submitting exam:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};
