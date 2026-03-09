export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    created_at?: Date;
    updated_at?: Date;
}