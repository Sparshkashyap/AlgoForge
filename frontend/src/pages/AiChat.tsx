import { Navbar } from "@/components/Navbar";
import AIChatBox from "@/components/AIChatBox";

export default function AiChat() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container max-w-5xl py-10">
        <div className="rounded-[1.8rem] border border-border/70 bg-card/75 p-6 md:p-8">
          <h1 className="font-heading text-3xl font-black md:text-4xl">
            AI Assistant
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Platform-aware assistant in Hinglish. It uses role-aware retrieval
            plus Gemini generation, and falls back to structured context if the
            Gemini key is missing.
          </p>
        </div>

        <div className="mt-6">
          <AIChatBox />
        </div>
      </div>
    </div>
  );
}