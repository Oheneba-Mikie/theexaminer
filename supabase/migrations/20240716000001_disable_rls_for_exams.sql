-- Disable RLS for exams table to fix the 42501 error
ALTER TABLE exams DISABLE ROW LEVEL SECURITY;

-- Disable RLS for questions table
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;

-- Disable RLS for submissions table
ALTER TABLE submissions DISABLE ROW LEVEL SECURITY;
