import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b py-4 px-6 bg-white">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Exam Portal</h1>
          <div className="flex gap-4">
            <Button variant="ghost" size="sm">
              About
            </Button>
            <Button variant="ghost" size="sm">
              Help
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Welcome to the Examiner
            </h2>
            <p className="text-muted-foreground text-lg">
              Upload PDF tests, automatically convert them to digital
              assessments, and manage student results
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Examiner Card */}
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Examiner Access</CardTitle>
                <CardDescription>
                  Upload PDF tests, manage exams, and view student results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Securely log in to upload test papers, generate unique exam
                  URLs, and export student results.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/examiner" className="w-full">
                  <Button className="w-full group">
                    Login as Examiner
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Student Card */}
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Student Access</CardTitle>
                <CardDescription>
                  Take exams using a unique URL provided by your examiner
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Enter your exam code or URL to access your test. Complete the
                  exam with a distraction-free interface.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/student" className="w-full">
                  <Button className="w-full group" variant="outline">
                    Access Exam
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold mb-4">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="font-medium text-primary">1</span>
                </div>
                <h4 className="font-medium mb-2">Upload PDF</h4>
                <p className="text-sm text-muted-foreground">
                  Examiners upload test papers in PDF format
                </p>
              </div>
              <div className="p-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="font-medium text-primary">2</span>
                </div>
                <h4 className="font-medium mb-2">AI Conversion</h4>
                <p className="text-sm text-muted-foreground">
                  Our AI automatically extracts and structures questions
                </p>
              </div>
              <div className="p-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="font-medium text-primary">3</span>
                </div>
                <h4 className="font-medium mb-2">Take Exams</h4>
                <p className="text-sm text-muted-foreground">
                  Students access and complete exams via unique URLs
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Exam Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
