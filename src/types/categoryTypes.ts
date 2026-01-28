export interface CategoryProps {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface CategoryCreateProps {
  name: string;
  description: string;
}

export interface ErrorProps {
  message: string;
}