export type ProblemTestCase = {
  id?: string;
  input: string;
  expected: string;
  explanation?: string;
  isHidden: boolean;
};

export type Problem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  tags: string[];
  constraints?: string | null;
  isPremium?: boolean;
  hasPremiumAccess?: boolean;
  boilerplateMode?: "provided" | "optional" | "none";
  sampleInput?: string | null;
  sampleOutput?: string | null;
  explanation?: string | null;
  starterCode?: Record<string, string> | null;
  languageTemplates?: Record<string, string> | null;
  referenceSolutions?: Record<string, string> | null;
  driverCode?: Record<string, string> | null;
  testCases?: ProblemTestCase[];
  createdAt?: string;
  updatedAt?: string;
  isPublished?: boolean;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
};