export enum ROLE {
  ADMIN = "ADMIN",
  USER = "USER",
  SUPERADMIN = "SUPERADMIN",
}

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
    name: string;
    email: string;
    role: ROLE;
    emailVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export interface GoogleUserData {
  email: string;
  name: string;
  picture: string;
  id: string;
}
