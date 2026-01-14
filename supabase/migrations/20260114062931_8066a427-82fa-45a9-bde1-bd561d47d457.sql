-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  class TEXT NOT NULL,
  section TEXT NOT NULL,
  age_group TEXT DEFAULT '15-18',
  photo_url TEXT,
  profession TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (for institute users)
CREATE POLICY "Anyone can view students" 
ON public.students 
FOR SELECT 
USING (true);

-- Create policy for public insert access
CREATE POLICY "Anyone can add students" 
ON public.students 
FOR INSERT 
WITH CHECK (true);

-- Create policy for public update access
CREATE POLICY "Anyone can update students" 
ON public.students 
FOR UPDATE 
USING (true);

-- Create policy for public delete access
CREATE POLICY "Anyone can delete students" 
ON public.students 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_students_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.update_students_updated_at();

-- Create storage bucket for student photos
INSERT INTO storage.buckets (id, name, public) VALUES ('student-photos', 'student-photos', true);

-- Create storage policies for student photos
CREATE POLICY "Student photos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'student-photos');

CREATE POLICY "Anyone can upload student photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'student-photos');

CREATE POLICY "Anyone can update student photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'student-photos');

CREATE POLICY "Anyone can delete student photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'student-photos');