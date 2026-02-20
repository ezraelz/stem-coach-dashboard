
export interface CourseProps {
  id: number;
  title: string;
  category: string;
  category_name: string;
  instructor: string;
  duration: number;
  level: string;
  icon: File | null;
  color: string;
    description: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
}

export interface CourseCreateProps {
  title: string;
  category: string;
  instructor: string;
  duration: number;
  level: string;
  icon: File | null;
  color: string;
    description: string;
    is_active: boolean;
}

export interface CourseUpdateProps {
  title: string;
  category: string;
  duration: number;
  level: string;
  color: string;
    description: string;
    is_active: boolean;
}

export interface ErrorProps {
  message: string;
}

export type ErrorsType = {
  title?: string;
  description?: string;
  instructor?: string;
  duration?: string;
  icon?: string;
  color?: string;
  is_active?: string;
  level?: string;
  category?: string;
  message?: string;
};
