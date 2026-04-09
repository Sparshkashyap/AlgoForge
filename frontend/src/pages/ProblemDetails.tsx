import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProblemBySlugApi } from "../api/problem.api";
import { createSubmissionApi } from "../api/submission.api";
import { getAiHintApi } from "../api/ai.api";
import CodeEditor from "../components/CodeEditor";
import SubmissionResult from "../components/SubmissionResult";

type Problem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  tags: string[];
  starterCode?: Record<string, string>;
};

export default function ProblemDetails() {
  const { slug } = useParams();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Write your solution here");
  const [submission, setSubmission] = useState<any>(null);
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getProblemBySlugApi(slug)
      .then((res) => {
        const p = res.data.data;
        setProblem(p);
        if (p.starterCode?.javascript) {
          setCode(p.starterCode.javascript);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSubmit = async () => {
    if (!problem) return;
    const res = await createSubmissionApi({
      problemId: problem.id,
      language,
      code
    });
    setSubmission(res.data.data);
  };

  const handleHint = async () => {
    if (!problem) return;
    const res = await getAiHintApi({
      title: problem.title,
      description: problem.description,
      code
    });
    setHint(res.data.data.hint);
  };

  if (loading) return <div className="p-10">Loading...</div>;
  if (!problem) return <div className="p-10">Problem not found</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 grid lg:grid-cols-2 gap-6">
      <div className="bg-white border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{problem.title}</h1>
          <span className="text-sm text-slate-500">{problem.difficulty}</span>
        </div>

        <div className="prose prose-slate max-w-none">
          <p>{problem.description}</p>
        </div>

        <div className="mt-4 flex gap-2 flex-wrap">
          {problem.tags?.map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 rounded-full bg-slate-100">
              {tag}
            </span>
          ))}
        </div>

        {hint && (
          <div className="mt-6 rounded-xl border bg-blue-50 border-blue-200 p-4 whitespace-pre-wrap text-sm">
            <h3 className="font-semibold mb-2">AI Hint</h3>
            {hint}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="bg-white border rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
            </select>

            <button
              onClick={handleHint}
              className="px-4 py-2 rounded-lg border bg-white"
            >
              Get AI Hint
            </button>

            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white"
            >
              Submit
            </button>
          </div>

          <CodeEditor language={language} value={code} onChange={setCode} />
        </div>

        <SubmissionResult result={submission} />
      </div>
    </div>
  );
}