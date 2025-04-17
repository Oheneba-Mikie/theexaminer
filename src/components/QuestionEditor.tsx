import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Question } from "@/types/exam";

interface QuestionEditorProps {
  questions: Question[];
}

export const QuestionEditor = ({ questions = [] }: QuestionEditorProps) => {
  const [editedQuestions, setEditedQuestions] = useState<Question[]>(questions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = editedQuestions[currentQuestionIndex] || {
    id: "",
    text: "",
    options: [],
    correctAnswer: "",
  };

  const handleQuestionTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const updatedQuestions = [...editedQuestions];
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      text: e.target.value,
    };
    setEditedQuestions(updatedQuestions);
  };

  const handleOptionTextChange = (optionId: string, newText: string) => {
    const updatedQuestions = [...editedQuestions];
    const updatedOptions = currentQuestion.options.map((option) =>
      option.id === optionId ? { ...option, text: newText } : option,
    );
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      options: updatedOptions,
    };
    setEditedQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (value: string) => {
    const updatedQuestions = [...editedQuestions];
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      correctAnswer: value,
    };
    setEditedQuestions(updatedQuestions);
  };

  const handleAddOption = () => {
    const updatedQuestions = [...editedQuestions];
    const newOptionId = String.fromCharCode(
      97 + currentQuestion.options.length,
    ); // a, b, c, d...
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      options: [
        ...currentQuestion.options,
        { id: newOptionId, text: "New option" },
      ],
    };
    setEditedQuestions(updatedQuestions);
  };

  const handleRemoveOption = (optionId: string) => {
    const updatedQuestions = [...editedQuestions];
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      options: currentQuestion.options.filter(
        (option) => option.id !== optionId,
      ),
      correctAnswer:
        currentQuestion.correctAnswer === optionId
          ? ""
          : currentQuestion.correctAnswer,
    };
    setEditedQuestions(updatedQuestions);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < editedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="space-y-6 bg-white">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Question {currentQuestionIndex + 1} of {editedQuestions.length}
        </h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === editedQuestions.length - 1}
          >
            Next
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question-text">Question Text</Label>
            <Textarea
              id="question-text"
              placeholder="Enter the question text"
              value={currentQuestion.text}
              onChange={handleQuestionTextChange}
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Answer Options</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                disabled={currentQuestion.options.length >= 6}
              >
                Add Option
              </Button>
            </div>

            <RadioGroup
              value={currentQuestion.correctAnswer}
              onValueChange={handleCorrectAnswerChange}
              className="space-y-3"
            >
              {currentQuestion.options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-2 space-y-0"
                >
                  <RadioGroupItem
                    value={option.id}
                    id={`option-${option.id}`}
                  />
                  <div className="flex-1">
                    <Input
                      value={option.text}
                      onChange={(e) =>
                        handleOptionTextChange(option.id, e.target.value)
                      }
                      placeholder={`Option ${option.id}`}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveOption(option.id)}
                    disabled={currentQuestion.options.length <= 2}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionEditor;
