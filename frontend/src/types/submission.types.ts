export type SubmissionStatus =
  | "QUEUED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | string;

export type Submission = {
  id?: string;
  language: string;
  languageId?: number | null;
  code?: string;
  status: SubmissionStatus;
  verdict?: string | null;
  stdout?: string | null;
  stderr?: string | null;
  compileOutput?: string | null;
  runtime?: string | null;
  memory?: string | null;
  passedCount?: number;
  totalCount?: number;
  createdAt?: string;
  updatedAt?: string;
  problem?: {
    id: string;
    title: string;
    slug: string;
    difficulty?: string;
    tags?: string[];
    isPremium?: boolean;
  };
};