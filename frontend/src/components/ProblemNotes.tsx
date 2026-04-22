import { useEffect, useState } from "react";
import {
  getMyProblemNoteApi,
  saveMyProblemNoteApi,
} from "@/api/problemNote.api";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function ProblemNotes({ problemId }: { problemId: string }) {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyProblemNoteApi(problemId).then((res) => {
      setContent(res?.data?.content || "");
    });
  }, [problemId]);

  const save = async () => {
    try {
      setSaving(true);
      await saveMyProblemNoteApi(problemId, content);
      toast.success("Notes saved");
    } catch {
      toast.error("Failed to save notes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-10 rounded-3xl border border-border bg-card p-6">
      <h2 className="text-2xl font-bold">My Notes</h2>

      <textarea
        className="mt-4 w-full rounded-xl border p-3 bg-background"
        rows={8}
        placeholder="Write your own notes, edge cases, patterns, reminders..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <Button className="mt-4 rounded-xl" onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save notes"}
      </Button>
    </div>
  );
}