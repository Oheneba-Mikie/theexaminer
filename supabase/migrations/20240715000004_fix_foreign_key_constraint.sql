-- Drop dependent tables and constraints first (in reverse order of dependency)
DROP TABLE IF EXISTS student_responses CASCADE;
DROP TABLE IF EXISTS question_options CASCADE;
DROP TABLE IF EXISTS exam_questions CASCADE;
DROP TABLE IF EXISTS exams CASCADE;

-- Create exams table with UUID primary key
CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  status TEXT NOT NULL,
  url TEXT,
  submissions INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id)
);

-- Create questions table with UUID primary key and UUID foreign key
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option_id TEXT NOT NULL
);

-- Create submissions table with UUID primary key and UUID foreign key
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  student_id TEXT NOT NULL,
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  exam_title TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  answers JSONB NOT NULL,
  score INTEGER,
  total_questions INTEGER NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE exams;
ALTER PUBLICATION supabase_realtime ADD TABLE questions;
ALTER PUBLICATION supabase_realtime ADD TABLE submissions;
