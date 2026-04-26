// ✅ FIRST THIS
export type TestCaseResult = {
  input: string;
  expected: string;
  actual?: string;
  stdout?: string;
  stderr?: string;
  compileOutput?: string;
  status: string;
  verdict?: string;
  runtime?: string | null;
  memory?: string | null;
};

// ✅ THEN THIS
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

  // 🔴 THIS WILL NOW WORK
  results?: TestCaseResult[];

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