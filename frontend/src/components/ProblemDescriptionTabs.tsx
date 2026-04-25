import {
  BookOpen,
  BookOpenCheck,
  FlaskConical,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import type { Problem } from "@/types/problem.types";
import type { Submission } from "@/types/submission.types";
import ProblemConstraints from "@/components/ProblemConstraints";
import ProblemReferenceSolutionsPanel from "@/components/ProblemReferenceSolutionsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  problem: Problem;
  previousSubmissions: Submission[];
  onUseSubmission: (code: string) => void;
};

function ContentSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: JSX.Element;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.4rem] border border-border/70 bg-background/50 p-5">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>

      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function ProblemDescriptionTabs({
  problem,
  previousSubmissions: _previousSubmissions,
  onUseSubmission: _onUseSubmission,
}: Props) {
  return (
    <Tabs defaultValue="description" className="h-full">
      <div className="mb-5 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-2xl font-black leading-tight md:text-3xl">
              {problem?.title || "Untitled Problem"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Read the prompt, inspect official solutions, and use the right-side
              workbench for test cases, run output, submit output, and all
              submissions.
            </p>
          </div>

          <div className="rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Workspace
          </div>
        </div>

        <TabsList className="h-auto w-full flex-wrap justify-start gap-2 rounded-[1.2rem] border border-border/70 bg-background/60 p-2">
          <TabsTrigger value="description" className="rounded-xl px-4 py-2">
            <ScrollText className="mr-2 h-4 w-4" />
            Description
          </TabsTrigger>
          <TabsTrigger value="solutions" className="rounded-xl px-4 py-2">
            <BookOpenCheck className="mr-2 h-4 w-4" />
            Solutions
          </TabsTrigger>
          <TabsTrigger value="editorial" className="rounded-xl px-4 py-2">
            <BookOpen className="mr-2 h-4 w-4" />
            Editorial
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="description" className="space-y-5">
        <ContentSection
          title="Problem Statement"
          icon={<ScrollText className="h-4 w-4 text-primary" />}
        >
          <div className="whitespace-pre-wrap text-sm leading-8 text-foreground/92">
            {problem?.description || "No problem description available."}
          </div>
        </ContentSection>

        {problem?.sampleInput ? (
          <ContentSection
            title="Sample Input"
            icon={<FlaskConical className="h-4 w-4 text-primary" />}
          >
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-[1rem] border border-border/60 bg-card/70 p-4 text-sm leading-7">
              {problem.sampleInput}
            </pre>
          </ContentSection>
        ) : null}

        {problem?.sampleOutput ? (
          <ContentSection
            title="Sample Output"
            icon={<FlaskConical className="h-4 w-4 text-primary" />}
          >
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-[1rem] border border-border/60 bg-card/70 p-4 text-sm leading-7">
              {problem.sampleOutput}
            </pre>
          </ContentSection>
        ) : null}

        <ProblemConstraints constraints={problem?.constraints} />

        {problem?.createdBy ? (
          <div className="rounded-[1.4rem] border border-border/70 bg-background/50 p-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Created by {problem.createdBy.name}
            </div>
          </div>
        ) : null}
      </TabsContent>

      <TabsContent value="solutions">
        <ProblemReferenceSolutionsPanel
          problemId={problem.id}
          referenceSolutions={problem.referenceSolutions}
        />
      </TabsContent>

      <TabsContent value="editorial">
        <div className="space-y-5">
          <ContentSection
            title="Editorial"
            icon={<BookOpen className="h-4 w-4 text-primary" />}
          >
            <div className="whitespace-pre-wrap text-sm leading-8 text-foreground/92">
              {problem?.explanation?.trim()
                ? problem.explanation
                : "No editorial has been added for this problem yet. Ask the creator/admin to add explanation notes, edge cases, and the intended approach."}
            </div>
          </ContentSection>

          <ProblemConstraints constraints={problem?.constraints} />
        </div>
      </TabsContent>
    </Tabs>
  );
}