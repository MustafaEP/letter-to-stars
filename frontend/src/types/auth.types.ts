export interface User {
    id: string;
    email: string;
    name: string | null;
    role: string;
}
  
export interface LoginRequest {
    email: string;
    password: string;
}
  
export interface RegisterRequest {
    email: string;
    password: string;
    name?: string;
}
  
export interface LoginResponse {
    accessToken: string;
    user: User;
}