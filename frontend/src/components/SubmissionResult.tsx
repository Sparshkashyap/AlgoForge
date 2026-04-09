type Props = {
  result: {
    status: string;
    runtime?: string;
    memory?: string;
    passedCount?: number;
    totalCount?: number;
  } | null;
};

export default function SubmissionResult({ result }: Props) {
  if (!result) return null;

  const success = result.status === "Accepted";

  return (
    <div
      className={`rounded-xl border p-4 ${
        success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
      }`}
    >
      <h3 className="font-semibold mb-2">Submission Result</h3>
      <div className="space-y-1 text-sm">
        <p>Status: {result.status}</p>
        <p>Runtime: {result.runtime || "-"}</p>
        <p>Memory: {result.memory || "-"}</p>
        <p>
          Passed: {result.passedCount || 0}/{result.totalCount || 0}
        </p>
      </div>
    </div>
  );
}