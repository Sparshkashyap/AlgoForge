import { useEffect, useState } from "react";
import {
  createDiscussionReplyApi,
  createProblemDiscussionApi,
  listProblemDiscussionsApi,
} from "@/api/discussion.api";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

export default function ProblemDiscussions({ problemId }: { problemId: string }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [replyMap, setReplyMap] = useState<Record<string, string>>({});

  const load = async () => {
    try {
      const res = await listProblemDiscussionsApi(problemId);
      setItems(res?.data || []);
    } catch {
      toast.error("Failed to load discussions");
    }
  };

  useEffect(() => {
    void load();
  }, [problemId]);

  const createPost = async () => {
    if (!content.trim()) return;

    try {
      await createProblemDiscussionApi(problemId, content);
      setContent("");
      await load();
    } catch {
      toast.error("Failed to create discussion");
    }
  };

  const createReply = async (discussionId: string) => {
    const value = replyMap[discussionId];
    if (!value?.trim()) return;

    try {
      await createDiscussionReplyApi(discussionId, value);
      setReplyMap((prev) => ({ ...prev, [discussionId]: "" }));
      await load();
    } catch {
      toast.error("Failed to create reply");
    }
  };

  return (
    <div className="mt-10 rounded-3xl border border-border bg-card p-6">
      <h2 className="text-2xl font-bold">Discussion</h2>

      {isAuthenticated && (
        <div className="mt-4">
          <textarea
            className="w-full rounded-xl border p-3 bg-background"
            rows={4}
            placeholder="Ask a doubt, share approach, or discuss edge cases..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button className="mt-3 rounded-xl" onClick={createPost}>
            Post discussion
          </Button>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-border p-4">
            <p className="font-semibold">{item.user?.name}</p>
            <p className="mt-2 text-sm text-muted-foreground">{item.content}</p>

            <div className="mt-4 space-y-3">
              {item.replies?.map((reply: any) => (
                <div
                  key={reply.id}
                  className="ml-4 rounded-xl border border-border/70 bg-background p-3"
                >
                  <p className="font-medium text-sm">{reply.user?.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {reply.content}
                  </p>
                </div>
              ))}
            </div>

            {isAuthenticated && (
              <div className="mt-4">
                <textarea
                  className="w-full rounded-xl border p-3 bg-background"
                  rows={2}
                  placeholder="Write reply..."
                  value={replyMap[item.id] || ""}
                  onChange={(e) =>
                    setReplyMap((prev) => ({
                      ...prev,
                      [item.id]: e.target.value,
                    }))
                  }
                />
                <Button
                  variant="outline"
                  className="mt-2 rounded-xl"
                  onClick={() => createReply(item.id)}
                >
                  Reply
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}