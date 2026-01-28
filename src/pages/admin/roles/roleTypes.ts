export interface RoleProps {
    id: number;
    name: string;
    description: string;
    created_at: string;
}

export interface RoleCreateProps {
    name: string;
    description: string;
}
export interface ErrorProps {
    message: string;
}
