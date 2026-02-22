export interface User {
    id: string;
    email: string;
    name: string | null;
    role: string;
    profilePicture?: string | null;  
    provider?: 'LOCAL' | 'GOOGLE';
    bio?: string | null;              
    emailVerified?: boolean;          
    lastLoginAt?: string;             
    createdAt?: string;
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
  
export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UserStats {
  totalEntries: number;
  totalWords: number;
  currentStreak: number;
  longestStreak: number;
  favoriteLevel: number | null;
  ieltsDistribution: Record<number, number>;
}