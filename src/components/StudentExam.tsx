import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle, Loader2 } from "lucide-react";
import { supabaseService } from "@/services/supabaseService";
import { useAuth } from "@/contexts/AuthContext";
import { Exam, Question as ExamQuestion } from "@/types/exam";

// Using the ExamQuestion type from exam.ts to ensure consistency
interface Question {
  id: string; // UUID
  text: string;
  options: {
    id: string; // UUID
    text: string;
  }[];
  correctAnswerId?: string; // UUID
}

interface StudentExamProps {
  examId?: string;
  examTitle?: string;
  questions?: Question[];
  onSubmit?: (answers: Record<string, string>) => void;
  urlExamId?: string; // For fetching exam by URL parameter
}

const StudentExam = ({
  examId: propExamId,
  examTitle: propExamTitle,
  questions: propQuestions,
  onSubmit = () => {},
  urlExamId,
}: StudentExamProps) => {
  // Auth context for student session
  const { studentSession, setStudentSession } = useAuth();

  // States
  const [studentName, setStudentName] = useState(
    studentSession?.studentName || "",
  );
  const [studentId, setStudentId] = useState(studentSession?.studentId || "");
  const [currentStep, setCurrentStep] = useState<
    "loading" | "auth" | "instructions" | "exam" | "confirmation" | "error"
  >(
    studentSession?.studentName && studentSession?.studentId
      ? "loading"
      : "auth",
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Exam data
  const [examData, setExamData] = useState<Exam | null>(null);
  const [loadingExam, setLoadingExam] = useState(false);

  // Derived values
  const examId = examData?.id || propExamId || "";
  const examTitle = examData?.title || propExamTitle || "Sample Examination";

  // Map Supabase exam questions to component format if needed
  const questions = examData?.questions
    ? examData.questions.map((q) => ({
        id: q.id,
        text: q.text,
        options: q.options,
        correctAnswerId: q.correctOptionId,
      }))
    : propQuestions || [
        {
          id: "q1",
          text: "What is the capital of France?",
          options: [
            { id: "a", text: "London" },
            { id: "b", text: "Paris" },
            { id: "c", text: "Berlin" },
            { id: "d", text: "Madrid" },
          ],
          correctAnswerId: "b",
        },
        {
          id: "q2",
          text: "Which planet is known as the Red Planet?",
          options: [
            { id: "a", text: "Venus" },
            { id: "b", text: "Jupiter" },
            { id: "c", text: "Mars" },
            { id: "d", text: "Saturn" },
          ],
          correctAnswerId: "c",
        },
        {
          id: "q3",
          text: "What is the chemical symbol for gold?",
          options: [
            { id: "a", text: "Go" },
            { id: "b", text: "Gd" },
            { id: "c", text: "Au" },
            { id: "d", text: "Ag" },
          ],
          correctAnswerId: "c",
        },
      ];

  // Fetch exam data
  useEffect(() => {
    const fetchExam = async () => {
      // Skip if no exam ID is provided or if we're using prop questions
      if (
        (!urlExamId && !propExamId) ||
        (propQuestions && propQuestions.length > 0 && !urlExamId && !propExamId)
      ) {
        setCurrentStep("auth");
        return;
      }

      setLoadingExam(true);
      setError(null);
      setCurrentStep("loading");

      console.log("Attempting to fetch exam with ID:", urlExamId || propExamId);

      try {
        // Validate UUID format before making the request
        const examId = urlExamId || propExamId || "";
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        // If not a UUID but we have a legacy ID, try to fetch by legacy ID
        // This ensures backward compatibility with existing exams
        const { data, error } = await supabaseService.getExamById(examId);

        if (error) {
          throw new Error(error);
        }

        if (data) {
          console.log("Fetched exam data:", data);
          setExamData(data);
          // If student is already authenticated, go to instructions
          if (studentSession?.studentName && studentSession?.studentId) {
            setCurrentStep("instructions");
          } else {
            setCurrentStep("auth");
          }
        } else {
          throw new Error("Exam not found");
        }
      } catch (err) {
        console.error("Error fetching exam:", err);
        setError(err instanceof Error ? err.message : "Failed to load exam");
        setCurrentStep("error");
      } finally {
        setLoadingExam(false);
      }
    };

    fetchExam();
  }, [urlExamId, propExamId, propQuestions, studentSession]);

  // Handlers
  const handleAuthentication = () => {
    if (studentName.trim() && studentId.trim()) {
      // Save student session
      setStudentSession({
        studentName: studentName.trim(),
        studentId: studentId.trim(),
        examId: examId,
      });
      setCurrentStep("instructions");
    }
  };

  const handleStartExam = () => {
    setCurrentStep("exam");
  };

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmitExam = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Submit to Supabase
      const submission = {
        studentName,
        studentId,
        examId, // This should now be a UUID from the database
        examTitle,
        answers, // Map of question UUID to selected option UUID
        totalQuestions: questions.length,
      };

      console.log("Submitting exam with data:", submission);
      const { data, error } = await supabaseService.submitExam(submission);

      if (error) {
        throw new Error(error);
      }

      console.log("Submission successful:", data);

      // Call the onSubmit prop if provided
      onSubmit(answers);

      // Clear student session after successful submission
      setStudentSession(null);

      setCurrentStep("confirmation");
    } catch (err) {
      console.error("Error submitting exam:", err);
      setError(err instanceof Error ? err.message : "Failed to submit exam");
    } finally {
      setIsSubmitting(false);
      setShowSubmitDialog(false);
    }
  };

  // Calculate progress
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredQuestionsCount = Object.keys(answers).length;
  const totalQuestionsCount = questions.length;

  // Current question
  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white shadow-lg">
        {currentStep === "loading" && (
          <div className="p-8 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-gray-600">Loading exam...</p>
          </div>
        )}

        {currentStep === "error" && (
          <div className="p-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-red-600">
                Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-red-50 rounded-md border border-red-100">
                <p className="text-red-800">
                  {error || "An unexpected error occurred"}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </CardFooter>
          </div>
        )}

        {currentStep === "auth" && (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">
                {examTitle}
              </CardTitle>
              <CardDescription>
                Please enter your details to begin the exam
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  placeholder="Enter your student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={handleAuthentication}
                disabled={!studentName.trim() || !studentId.trim()}
              >
                Continue
              </Button>
            </CardFooter>
          </>
        )}

        {currentStep === "instructions" && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Exam Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2">
                  Welcome, {studentName}
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                  <li>
                    This exam contains {questions.length} multiple-choice
                    questions.
                  </li>
                  <li>You will see one question at a time.</li>
                  <li>
                    Use the Previous and Next buttons to navigate between
                    questions.
                  </li>
                  <li>
                    You can review and change your answers before final
                    submission.
                  </li>
                  <li>
                    Once you submit the exam, you cannot return to change
                    answers.
                  </li>
                  <li>
                    The progress bar at the top shows your position in the exam.
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleStartExam}>
                Start Exam
              </Button>
            </CardFooter>
          </>
        )}

        {currentStep === "exam" && currentQuestion && (
          <>
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <CardTitle className="text-xl font-bold text-gray-800">
                  {examTitle}
                </CardTitle>
                <span className="text-sm text-gray-500">
                  Student: {studentName}
                </span>
              </div>
              <div className="space-y-1">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <span>
                    {answeredQuestionsCount} of {totalQuestionsCount} answered
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="text-lg font-medium mb-2">
                  Question {currentQuestionIndex + 1}
                </h3>
                <p className="text-gray-800">{currentQuestion.text}</p>
              </div>

              <RadioGroup
                value={selectedAnswer}
                onValueChange={(value) =>
                  handleAnswerSelect(currentQuestion.id, value)
                }
                className="space-y-3"
              >
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-2 p-3 rounded-md border hover:bg-gray-50 transition-colors"
                  >
                    <RadioGroupItem
                      value={option.id}
                      id={`option-${option.id}`}
                    />
                    <Label
                      htmlFor={`option-${option.id}`}
                      className="flex-grow cursor-pointer"
                    >
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                <Button
                  variant="outline"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
              </div>
              <div className="flex space-x-2">
                {currentQuestionIndex < questions.length - 1 ? (
                  <Button onClick={handleNextQuestion}>Next</Button>
                ) : (
                  <Button
                    onClick={() => setShowSubmitDialog(true)}
                    variant="default"
                  >
                    Submit Exam
                  </Button>
                )}
              </div>
            </CardFooter>
          </>
        )}

        {currentStep === "confirmation" && (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Exam Submitted Successfully
              </CardTitle>
              <CardDescription>
                Thank you for completing the exam
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-gray-700 mb-2">
                  Your responses have been recorded.
                </p>
                <p className="text-gray-700">You may now close this window.</p>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <p className="text-sm text-gray-500">Exam ID: {examId}</p>
            </CardFooter>
          </>
        )}
      </Card>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Exam</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredQuestionsCount} out of{" "}
              {totalQuestionsCount} questions.
              {answeredQuestionsCount < totalQuestionsCount && (
                <span className="text-amber-600 font-medium">
                  {" "}
                  Some questions are still unanswered.
                </span>
              )}
              <br />
              <br />
              Are you sure you want to submit your exam? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSubmitDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitExam} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Exam"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StudentExam;
