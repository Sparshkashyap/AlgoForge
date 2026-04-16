export type UserRole = "USER" | "CREATOR" | "ADMIN";
export type UserPlan = "FREE" | "STANDARD" | "PRO";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan?: UserPlan;
  avatarUrl?: string | null;
  solvedCount?: number;
  streak?: number;
  createdAt?: string;
  lastSeenAt?: string | null;
  _count?: {
    submissions: number;
    problems: number;
  };
};