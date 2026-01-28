export interface UsersProps {
    id: number;
    full_name: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    role_name: string;
    phone_number: string;
    department?: string;
    is_active: boolean;
    created_at: string;
}

export interface UserCreateProps {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    role: string;
    password: string;
    department?: string;
}

export interface ErrorsProps {
    [key: string]: string;
}