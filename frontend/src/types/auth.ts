export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string | null;
  email: string;
  avatar: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
