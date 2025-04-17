-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create exams table with TEXT primary key
CREATE TABLE IF NOT EXISTS exams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL,
  url TEXT,
  submissions INTEGER DEFAULT 0
);

-- Create questions table with TEXT primary key and foreign key
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL,
  text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option_id TEXT NOT NULL,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- Create submissions table with TEXT primary key
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  student_name TEXT NOT NULL,
  student_id TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  exam_title TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  answers JSONB NOT NULL,
  score INTEGER,
  total_questions INTEGER NOT NULL,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
DROP POLICY IF EXISTS "Public access to exams" ON exams;
CREATE POLICY "Public access to exams" ON exams FOR ALL USING (true);

DROP POLICY IF EXISTS "Public access to questions" ON questions;
CREATE POLICY "Public access to questions" ON questions FOR ALL USING (true);

DROP POLICY IF EXISTS "Public access to submissions" ON submissions;
CREATE POLICY "Public access to submissions" ON submissions FOR ALL USING (true);

-- Enable realtime
alter publication supabase_realtime add table exams;
alter publication supabase_realtime add table questions;
alter publication supabase_realtime add table submissions;