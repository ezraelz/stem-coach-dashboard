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
    address: string;
    department?: string;
    is_active: boolean;
    created_at: string;
    last_login: string;
}
export interface UsersDetailProps {
    id: number;
    full_name: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    role_name: string;
    phone_number: string;
    address: string;
    department?: string;
    is_active: boolean;
    created_at: string;
    last_login: string;
    isOpen: boolean;
    onClose: () => void;
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