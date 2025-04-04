export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  emailVerified: boolean;
}

export interface AuthState {
  isLoading: boolean;
  user: User | null;
  isLoggedIn: boolean;
}
