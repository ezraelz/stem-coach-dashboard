import type { LessonProps } from "./lessonTypes";

export interface FileProps {
  id: number;
  type: string;
  lesson: LessonProps;
  lesson_name: string;
  uploaded_at: string;
  is_active: boolean;
}

export interface FileCreateProps {
  lesson: number;
  lesson_name: string;
  type: string;
  uploaded_at: string;
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