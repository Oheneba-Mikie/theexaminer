import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Session } from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  studentSession: {
    studentName: string;
    studentId: string;
    examId: string | null;
  } | null;
  setStudentSession: (
    session: {
      studentName: string;
      studentId: string;
      examId: string | null;
    } | null,
  ) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [studentSession, setStudentSession] = useState<{
    studentName: string;
    studentId: string;
    examId: string | null;
  } | null>(null);

  useEffect(() => {
    // Check for an existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    // Check for stored student session
    const storedStudentSession = localStorage.getItem("studentSession");
    if (storedStudentSession) {
      try {
        setStudentSession(JSON.parse(storedStudentSession));
      } catch (error) {
        console.error("Error parsing stored student session:", error);
        localStorage.removeItem("studentSession");
      }
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Update student session in localStorage when it changes
  useEffect(() => {
    if (studentSession) {
      localStorage.setItem("studentSession", JSON.stringify(studentSession));
    } else {
      localStorage.removeItem("studentSession");
    }
  }, [studentSession]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error ? error.message : null };
    } catch (error) {
      console.error("Error signing in:", error);
      return { error: "An unexpected error occurred" };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    isLoading,
    signIn,
    signOut,
    studentSession,
    setStudentSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
