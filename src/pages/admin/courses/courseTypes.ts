export interface CourseType {
  id: number;
  title: string;
    description: string;
    is_active: boolean;
    icon: string | null;
    color: string;
    instructor: string;
    duration: number;
    level: string;
    category: string;
    created_at: string;
    updated_at: string;
}

export interface CourseFormData {
  title: string;
    description: string;
    is_active: boolean;
    icon: File | null;
    color: string;
    instructor: string;
    duration: number;
    level: string;
    category: string;
}

export interface ErrorsType {
  [key: string]: string;
}