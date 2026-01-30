export interface DepartmentProps {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface DepartmentCreateProps {
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ErrorProps {
  message: string;
}

export type ErrorsType = {
  name?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  message?: string;
}