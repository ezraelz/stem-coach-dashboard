import type { LessonProps } from "./lessonTypes";

export interface FileProps {
  id: number;
  file: File | null;
  type: string;
  lesson: LessonProps;
  lesson_name: string;
  course_name: string;
  uploaded_at: string;
  is_active: boolean;
}

export interface FileCreateProps {
  lesson: number;
  lesson_name: string;
  file: File | null;
  type: string;
  uploaded_at: string;
  is_active: boolean;
}

export interface FileUpdateProps {
  lesson: number;
  file: File | null;
  course: string;
  type: string;
  is_active: boolean;
}

export interface ErrorProps {
  message: string;
}

export type ErrorsType = {
  lesson?: number;
  lesson_name?: string;
  uploaded_at?: string;
  is_active?: boolean;
  message?: string;
}