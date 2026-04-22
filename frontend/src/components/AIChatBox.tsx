import { useState } from "react";
import { MessageSquareText, SendHorizontal, Sparkles } from "lucide-react";
import { toast } from "react-toastify";

import { askAiAssistantApi } from "@/api/ai.api";
import { Button } from "@/components/ui/button";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AIChatBox() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bhai, jo bhi poochna hai pooch. Main AlgoForge context ke hisaab se role-aware Hinglish me help karunga.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || loading) return;

    const nextUserMessage: Message = {
      role: "user",
      content: trimmedQuestion,
    };

    setMessages((prev) => [...prev, nextUserMessage]);
    setQuestion("");

    try {
      setLoading(true);

      const response = await askAiAssistantApi(trimmedQuestion);
      const answer = response?.data?.answer || "No answer generated";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.message || "AI chat failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[1.8rem] border border-border/70 bg-card/70 p-5 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
          <MessageSquareText className="h-4 w-4" />
        </div>

        <div>
          <p className="text-sm font-semibold">AI Chat</p>
          <p className="text-xs text-muted-foreground">
            Platform-aware Hinglish assistant
          </p>
        </div>
      </div>

      <div className="mt-5 max-h-[380px] space-y-3 overflow-y-auto rounded-2xl border border-border/70 bg-background/40 p-4">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-7 ${
              message.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "border border-border/70 bg-card text-foreground"
            }`}
          >
            {message.content}
          </div>
        ))}

        {loading && (
          <div className="max-w-[90%] rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm text-muted-foreground">
            Thinking with context...
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        <textarea
          className="min-h-[88px] flex-1 rounded-2xl border border-border/70 bg-background/50 p-3 text-sm outline-none"
          placeholder="Ask about roadmap, weak areas, creator quality, admin insights, contests, billing..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <Button
          type="button"
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          className="h-auto rounded-2xl px-5"
        >
          {loading ? (
            <Sparkles className="h-4 w-4 animate-pulse" />
          ) : (
            <SendHorizontal className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}