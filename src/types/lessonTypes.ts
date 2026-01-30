export interface LessonProps {
  id: number;
  course: number;
  course_name: string;
  title: string;
    content: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
}

export interface LessonCreateProps {
  title: string;
  day: number;
  course: number;
  file: null;
  content: string;
  is_active: boolean;
}

export interface ErrorProps {
  message: string;
}

export type ErrorsType = {
  title?: string;
  day?: number;
  course?: string;
  content?: string;
  message?: string;
}