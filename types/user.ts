export type UserRole = 'coordinator' | 'volunteer';

export interface User {
    id: number;
    name: string;
    phone: string;
    password: string;
    birthDate?: string;
    employmentStatus?: string;
    school?: string;
    customSchool?: string;
    university?: string;
    customUniversity?: string;
    workPlace?: string;
    post?: string;
    role: UserRole;
}