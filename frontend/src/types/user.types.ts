export type UserRole = "USER" | "CREATOR" | "ADMIN";

export type UserPlan = "FREE" | "STANDARD" | "PRO";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: UserPlan;
  avatarUrl?: string | null;
  provider?: string;
  solvedCount?: number;
  streak?: number;
  isBlocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
};