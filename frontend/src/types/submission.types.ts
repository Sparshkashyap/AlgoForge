export type Submission = {
  id?: string;
  language: string;
  languageId?: number;
  code?: string;
  status: string;
  verdict?: string | null;
  stdout?: string | null;
  stderr?: string | null;
  compileOutput?: string | null;
  runtime?: string | null;
  memory?: string | null;
  passedCount?: number;
  totalCount?: number;
  createdAt?: string;
  problem?: {
    id: string;
    title: string;
    slug: string;
    tags?: string[];
    isPremium?: boolean;
  };
};