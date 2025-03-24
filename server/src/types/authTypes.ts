import { ROLE } from "@prisma/client";

export interface RegisterUserParams {
  name: string;
  email: string;
  password: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role: ROLE;
    emailVerified: boolean;
    avatar: string | null;
  };
  accessToken: string;
  refreshToken: string;
}

export interface GoogleUserData {
  id: number;
  email: string;
  name: string;
  picture: string;
}
