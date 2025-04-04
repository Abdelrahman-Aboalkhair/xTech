export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  emailVerified: boolean;
  permissions: string[];
}

export interface AuthState {
  accessToken: string | null;
  isLoading: boolean;
  user: User | null;
  isLoggedIn: boolean;
  googleLoginInProgress: boolean;
}
