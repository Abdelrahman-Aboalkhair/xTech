type ROLE = "USER" | "ADMIN" | "SUPERADMIN";

export interface User {
  id: string;
  role: ROLE;
  name?: string;
  email?: string;
  emailVerified?: boolean;
  avatar?: string | null;
}
