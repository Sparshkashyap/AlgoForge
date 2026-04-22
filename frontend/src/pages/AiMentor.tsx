import { useState } from "react";
import API from "@/api/axios";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";

export default function AiMentor() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [answer, setAnswer] = useState("");

  const ask = async () => {
    const res = await API.post("/ai/explain", { code, language });
    setAnswer(res.data.data.explanation);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-10 max-w-4xl">
        <h1 className="text-3xl font-bold">AI Mentor</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Hinglish-first coding help for your platform.
        </p>

        <select
          className="mt-6 rounded-xl border p-3 bg-background"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>

        <textarea
          className="mt-4 w-full rounded-xl border p-3 bg-background"
          rows={14}
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <Button className="mt-4 rounded-xl" onClick={ask}>
          Explain my code
        </Button>

        {answer && (
          <div className="mt-6 rounded-xl border p-4 bg-card">
            <h2 className="font-semibold">AI Response</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
              {answer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}