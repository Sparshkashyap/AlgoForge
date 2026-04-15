export type UserRole = "USER" | "ADMIN";

export type UserPlan = "FREE" | "PRO";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole | string;
  avatarUrl?: string | null;
  plan?: UserPlan | string;
  solvedCount?: number;
  streak?: number;
  createdAt?: string;
  updatedAt?: string;
};