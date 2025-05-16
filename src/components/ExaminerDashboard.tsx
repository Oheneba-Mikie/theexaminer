import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  FileUp,
  Copy,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import QuestionEditor from "./QuestionEditor";
import { aiService } from "@/services/aiService";
import { Question } from "@/types/exam";

// Using the Exam interface from types/exam.ts for consistency
interface DashboardExam {
  id: string; // UUID
  title: string;
  createdAt: string;
  questionsCount: number;
  status: "active" | "draft";
  url: string;
  submissions: number;
}

interface Submission {
  id: string;
  studentName: string;
  studentId: string;
  examTitle: string;
  submittedAt: string;
  score: number;
  totalQuestions: number;
}

interface EditorQuestion {
  id: string; // UUID
  text: string;
  options: { id: string; text: string }[];
  correctAnswer: string; // UUID of the correct option
}

const ExaminerDashboard = () => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [processingStatus, setProcessingStatus] = useState<
    | "idle"
    | "uploading"
    | "processing"
    | "success"
    | "error"
    | "validation-error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [extractedQuestions, setExtractedQuestions] = useState<Question[]>([]);
  const [examTitle, setExamTitle] = useState<string>("");

  // Process the PDF file with the AI service
  const processFileWithAI = async (file: File) => {
    try {
      console.log(
        "Processing file with AI, API key present:",
        !!import.meta.env.VITE_DEEPSEEK_API_KEY,
      );
      const response = await aiService.extractQuestionsFromPDF(file);

      if (response.error) {
        setErrorMessage(response.error);
        setProcessingStatus("error");
        return;
      }

      if (response.questions.length === 0) {
        setErrorMessage(
          "No questions were extracted from the PDF. Please try a different file.",
        );
        setProcessingStatus("error");
        return;
      }

      setExtractedQuestions(response.questions);
      setExamTitle(file.name.replace(".pdf", ""));
      setProcessingStatus("success");
    } catch (error) {
      console.error("Error processing PDF:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
      setProcessingStatus("error");
    }
  };

  // Exams state
  const [exams, setExams] = useState<DashboardExam[]>([
    {
      id: "123e4567-e89b-12d3-a456-426614174000", // Example UUID
      title: "Midterm Exam - Biology 101",
      createdAt: "2023-05-15",
      questionsCount: 25,
      status: "active",
      url: "https://example.com/exam/123e4567-e89b-12d3-a456-426614174000",
      submissions: 42,
    },
    {
      id: "223e4567-e89b-12d3-a456-426614174001", // Example UUID
      title: "Final Exam - Chemistry 202",
      createdAt: "2023-06-01",
      questionsCount: 30,
      status: "active",
      url: "https://example.com/exam/223e4567-e89b-12d3-a456-426614174001",
      submissions: 38,
    },
    {
      id: "323e4567-e89b-12d3-a456-426614174002", // Example UUID
      title: "Quiz - Physics 101",
      createdAt: "2023-06-10",
      questionsCount: 15,
      status: "draft",
      url: "https://example.com/exam/323e4567-e89b-12d3-a456-426614174002",
      submissions: 0,
    },
  ]);

  // Mock data for submissions
  const submissions: Submission[] = [
    {
      id: "1",
      studentName: "John Doe",
      studentId: "S12345",
      examTitle: "Midterm Exam - Biology 101",
      submittedAt: "2023-05-20 14:30",
      score: 22,
      totalQuestions: 25,
    },
    {
      id: "2",
      studentName: "Jane Smith",
      studentId: "S12346",
      examTitle: "Midterm Exam - Biology 101",
      submittedAt: "2023-05-20 15:15",
      score: 24,
      totalQuestions: 25,
    },
    {
      id: "3",
      studentName: "Bob Johnson",
      studentId: "S12347",
      examTitle: "Chemistry 202",
      submittedAt: "2023-06-05 10:45",
      score: 27,
      totalQuestions: 30,
    },
  ];

  // Mock questions for the editor with UUID format
  const mockQuestions: EditorQuestion[] = [
    {
      id: "123e4567-e89b-12d3-a456-426614174010", // Example UUID
      text: "What is the powerhouse of the cell?",
      options: [
        { id: "123e4567-e89b-12d3-a456-426614174011", text: "Nucleus" },
        { id: "123e4567-e89b-12d3-a456-426614174012", text: "Mitochondria" },
        {
          id: "123e4567-e89b-12d3-a456-426614174013",
          text: "Endoplasmic Reticulum",
        },
        { id: "123e4567-e89b-12d3-a456-426614174014", text: "Golgi Apparatus" },
      ],
      correctAnswer: "123e4567-e89b-12d3-a456-426614174012", // UUID of the "Mitochondria" option
    },
    {
      id: "223e4567-e89b-12d3-a456-426614174020", // Example UUID
      text: "Which of the following is NOT a state of matter?",
      options: [
        { id: "223e4567-e89b-12d3-a456-426614174021", text: "Solid" },
        { id: "223e4567-e89b-12d3-a456-426614174022", text: "Liquid" },
        { id: "223e4567-e89b-12d3-a456-426614174023", text: "Gas" },
        { id: "223e4567-e89b-12d3-a456-426614174024", text: "Energy" },
      ],
      correctAnswer: "223e4567-e89b-12d3-a456-426614174024", // UUID of the "Energy" option
    },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      setErrorMessage("Please upload a PDF file");
      setProcessingStatus("validation-error");
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setErrorMessage("File size exceeds 10MB limit");
      setProcessingStatus("validation-error");
      return;
    }

    setProcessingStatus("uploading");

    // Simulate file upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setProcessingStatus("processing");

        // Process the PDF with the AI service
        processFileWithAI(file);
      }
    }, 300);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      setErrorMessage("Please upload a PDF file");
      setProcessingStatus("validation-error");
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setErrorMessage("File size exceeds 10MB limit");
      setProcessingStatus("validation-error");
      return;
    }

    setProcessingStatus("uploading");

    // Simulate file upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setProcessingStatus("processing");

        // Process the PDF with the AI service
        processFileWithAI(file);
      }
    }, 300);
  };

  const handleCopyUrl = (url: string, examId: string) => {
    // Use the current domain for sharing
    const fullUrl = url || `${window.location.origin}/${examId}`;
    navigator.clipboard.writeText(fullUrl);
    alert(
      "Exam URL copied to clipboard! You can now share this with students.",
    );
  };

  const handleExportResults = () => {
    // Logic to export results as CSV
    try {
      // Convert submissions to CSV format
      const headers = [
        "Student Name",
        "Student ID",
        "Exam Title",
        "Submitted At",
        "Score",
        "Total Questions",
        "Percentage",
      ];
      const csvRows = [
        headers.join(","),
        ...submissions.map((submission) => {
          const percentage = Math.round(
            (submission.score / submission.totalQuestions) * 100,
          );
          return [
            submission.studentName,
            submission.studentId,
            submission.examTitle,
            submission.submittedAt,
            submission.score,
            submission.totalQuestions,
            `${percentage}%`,
          ].join(",");
        }),
      ];

      const csvContent = csvRows.join("\n");

      // Create a blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `exam-results-${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("Exporting results as CSV");
    } catch (error) {
      console.error("Error exporting results:", error);
      alert("Failed to export results. Please try again.");
    }
  };

  const handleSaveExam = async () => {
    try {
      setProcessingStatus("processing");

      // Generate UUIDs for questions and options if they don't already have them
      // In a real implementation, this would be handled by the backend
      const questionsWithUUIDs = extractedQuestions.map((q) => {
        // Generate UUIDs for options if they don't have them
        const optionsWithUUIDs = q.options.map((option) => ({
          id: option.id.length === 36 ? option.id : crypto.randomUUID(),
          text: option.text,
        }));

        // Find the correct option in the new array
        const correctOption = optionsWithUUIDs.find(
          (o, index) => q.options[index].id === q.correctAnswer,
        );

        return {
          ...q,
          id: q.id.length === 36 ? q.id : crypto.randomUUID(),
          options: optionsWithUUIDs,
          correctOptionId: correctOption
            ? correctOption.id
            : optionsWithUUIDs[0].id,
        };
      });

      // Create the exam object
      const newExam = {
        title: examTitle,
        questions: questionsWithUUIDs,
        status: "active" as const,
      };

      console.log("Creating exam with UUID-based questions:", newExam);

      // Save the exam using the aiService
      const response = await aiService.createExam(newExam);

      if (response.error) {
        setErrorMessage(response.error);
        setProcessingStatus("error");
        return;
      }

      // Reset the form
      setProcessingStatus("idle");
      setExtractedQuestions([]);
      setExamTitle("");

      // Add the new exam to the exams list with UUID
      const examId = response.data?.id || crypto.randomUUID();
      const examUrl =
        response.data?.url || `${window.location.origin}/exam/${examId}`;

      setExams((prevExams) => [
        {
          id: examId,
          title: examTitle,
          createdAt: new Date().toISOString().split("T")[0],
          questionsCount: extractedQuestions.length,
          status: "active",
          url: examUrl,
          submissions: 0,
        },
        ...prevExams,
      ]);

      // Switch to the manage tab to show the newly created exam
      document.querySelector('[data-value="manage"]')?.click();

      // Show success message
      alert(
        "Exam saved successfully! You can now share the exam URL with students.",
      );
    } catch (error) {
      console.error("Error saving exam:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
      setProcessingStatus("error");
    }
  };

  const renderUploadSection = () => {
    if (processingStatus === "success" && extractedQuestions.length > 0) {
      return (
        <div className="space-y-6">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>PDF Successfully Processed</AlertTitle>
            <AlertDescription>
              We've extracted {extractedQuestions.length} questions from your
              PDF. Please review them below.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <Label htmlFor="exam-title">Exam Title</Label>
            <Input
              id="exam-title"
              placeholder="Enter a title for this exam"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
            />
          </div>

          <QuestionEditor questions={extractedQuestions} />

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setProcessingStatus("idle")}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveExam}>Save Exam</Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div
          className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <FileUp className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Upload PDF Test Paper</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Drag and drop your PDF file here, or click to browse. Our AI
                will extract questions automatically.
              </p>
            </div>
            <Label htmlFor="pdf-upload" className="cursor-pointer">
              <div className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                Browse Files
              </div>
              <Input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileUpload}
              />
            </Label>
          </div>
        </div>

        {processingStatus === "uploading" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading PDF...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}

        {processingStatus === "processing" && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertTitle>Processing PDF</AlertTitle>
            <AlertDescription>
              Our AI is analyzing your PDF and extracting questions. This may
              take a minute...
            </AlertDescription>
          </Alert>
        )}

        {processingStatus === "error" && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Processing PDF</AlertTitle>
            <AlertDescription>
              {errorMessage ||
                "We encountered an error while processing your PDF. Please try again or use a different file."}
            </AlertDescription>
          </Alert>
        )}

        {processingStatus === "validation-error" && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Invalid File</AlertTitle>
            <AlertDescription>
              {errorMessage ||
                "Please ensure you're uploading a valid PDF file under 10MB."}
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-8 bg-background">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Examiner Dashboard</h1>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8" data-tabs-list>
          <TabsTrigger value="upload" data-value="upload">
            Upload Exam
          </TabsTrigger>
          <TabsTrigger value="manage" data-value="manage">
            Manage Exams
          </TabsTrigger>
          <TabsTrigger value="results" data-value="results">
            Student Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Exam</CardTitle>
              <CardDescription>
                Upload a PDF test paper and our AI will convert it to a digital
                exam format.
              </CardDescription>
            </CardHeader>
            <CardContent>{renderUploadSection()}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Exams</CardTitle>
              <CardDescription>
                View and manage all your created exams.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">
                        {exam.title}
                      </TableCell>
                      <TableCell>{exam.createdAt}</TableCell>
                      <TableCell>{exam.questionsCount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            exam.status === "active" ? "default" : "outline"
                          }
                        >
                          {exam.status === "active" ? "Active" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>{exam.submissions}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyUrl(exam.url, exam.id)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy URL
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Student Results</CardTitle>
                <CardDescription>
                  View and export student submission results.
                </CardDescription>
              </div>
              <Button onClick={handleExportResults}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Exam</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        {submission.studentName}
                      </TableCell>
                      <TableCell>{submission.studentId}</TableCell>
                      <TableCell>{submission.examTitle}</TableCell>
                      <TableCell>{submission.submittedAt}</TableCell>
                      <TableCell>{`${submission.score}/${submission.totalQuestions}`}</TableCell>
                      <TableCell>
                        {Math.round(
                          (submission.score / submission.totalQuestions) * 100,
                        )}
                        %
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExaminerDashboard;
