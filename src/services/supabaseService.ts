import { supabase } from "@/lib/supabaseClient";
import { Exam, Question, Submission } from "@/types/exam";

/**
 * Service for interacting with Supabase database
 */
export const supabaseService = {
  /**
   * Create a new exam
   * @param exam The exam data to create
   * @returns A promise that resolves to the created exam
   */
  async createExam(
    exam: Omit<Exam, "id" | "createdAt">,
  ): Promise<{ data: Exam | null; error: string | null }> {
    try {
      // Insert the exam - UUID will be generated automatically by Supabase
      const { data, error } = await supabase
        .from("exams")
        .insert({
          title: exam.title,
          status: exam.status,
          submissions: 0,
        })
        .select()
        .single();

      if (error) throw error;

      // Get the generated UUID
      const examId = data.id;

      // Update the URL with the UUID
      const { error: urlError } = await supabase
        .from("exams")
        .update({ url: `${window.location.origin}/exam/${examId}` })
        .eq("id", examId);

      if (urlError) throw urlError;

      // Insert questions for the exam
      if (exam.questions && exam.questions.length > 0) {
        const { error: questionsError } = await supabase
          .from("questions")
          .insert(
            exam.questions.map((q) => ({
              exam_id: examId,
              text: q.text,
              options: q.options,
              correct_option_id: q.correctOptionId,
            })),
          );

        if (questionsError) throw questionsError;
      }

      // Get the questions for this exam
      const { data: questionsData, error: fetchError } = await supabase
        .from("questions")
        .select("*")
        .eq("exam_id", examId);

      if (fetchError) throw fetchError;

      // Combine the data
      const examWithQuestions: Exam = {
        ...data,
        questions: questionsData.map((q) => ({
          id: q.id,
          text: q.text,
          options: q.options,
          correctOptionId: q.correct_option_id,
        })),
      };

      return { data: examWithQuestions, error: null };
    } catch (error) {
      console.error("Error creating exam:", error);
      return {
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  /**
   * Get all exams
   * @returns A promise that resolves to an array of exams
   */
  async getExams(): Promise<{ data: Exam[] | null; error: string | null }> {
    try {
      // Get all exams
      const { data: examsData, error: examsError } = await supabase
        .from("exams")
        .select("*")
        .order("created_at", { ascending: false });

      if (examsError) throw examsError;

      // For each exam, get its questions
      const examsWithQuestions = await Promise.all(
        examsData.map(async (exam) => {
          const { data: questionsData, error: questionsError } = await supabase
            .from("questions")
            .select("*")
            .eq("exam_id", exam.id);

          if (questionsError) throw questionsError;

          return {
            ...exam,
            questions: questionsData.map((q) => ({
              id: q.id,
              text: q.text,
              options: q.options,
              correctOptionId: q.correct_option_id,
            })),
          };
        }),
      );

      return { data: examsWithQuestions, error: null };
    } catch (error) {
      console.error("Error fetching exams:", error);
      return {
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  /**
   * Get an exam by ID
   * @param examId The ID of the exam to get
   * @returns A promise that resolves to the exam
   */
  async getExamById(
    examId: string,
  ): Promise<{ data: Exam | null; error: string | null }> {
    try {
      // First get the exam
      const { data: examData, error: examError } = await supabase
        .from("exams")
        .select("*")
        .eq("id", examId)
        .single();

      if (examError) throw examError;

      // Then get the questions for this exam
      const { data: questionsData, error: questionsError } = await supabase
        .from("questions")
        .select("*")
        .eq("exam_id", examId);

      if (questionsError) throw questionsError;

      // Combine the data
      const exam: Exam = {
        ...examData,
        questions: questionsData.map((q) => ({
          id: q.id,
          text: q.text,
          options: q.options,
          correctOptionId: q.correct_option_id,
        })),
      };

      return { data: exam, error: null };
    } catch (error) {
      console.error("Error fetching exam:", error);
      return {
        data: null,
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
  ): Promise<{ data: Submission | null; error: string | null }> {
    try {
      // Get the exam to calculate the score
      const { data: exam, error: examError } = await this.getExamById(
        submission.examId,
      );
      if (examError || !exam) {
        return { data: null, error: "Failed to retrieve exam for scoring" };
      }

      // Calculate the score
      let score = 0;
      Object.entries(submission.answers).forEach(([questionId, answerId]) => {
        const question = exam.questions.find((q) => q.id === questionId);
        if (question && question.correctOptionId === answerId) {
          score++;
        }
      });

      // Insert the submission
      const { data, error } = await supabase
        .from("submissions")
        .insert({
          student_name: submission.studentName,
          student_id: submission.studentId,
          exam_id: submission.examId,
          exam_title: submission.examTitle,
          answers: submission.answers,
          score: score,
          total_questions: submission.totalQuestions,
        })
        .select()
        .single();

      if (error) throw error;

      // Update the exam's submission count
      const { error: updateError } = await supabase
        .from("exams")
        .update({ submissions: exam.submissions ? exam.submissions + 1 : 1 })
        .eq("id", submission.examId);

      if (updateError) throw updateError;

      return { data: data as unknown as Submission, error: null };
    } catch (error) {
      console.error("Error submitting exam:", error);
      return {
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};
