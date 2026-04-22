import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bot,
  Bookmark,
  BrainCircuit,
  ChartColumn,
  GraduationCap,
  MessageSquareText,
  Trophy,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { listLearningPathsApi } from "@/api/learningPath.api";

export default function Home() {
  const [paths, setPaths] = useState<any[]>([]);

  useEffect(() => {
    listLearningPathsApi().then((res) => {
      setPaths(res?.data || []);
    });
  }, []);

  const features = [
    {
      icon: Trophy,
      title: "Leaderboard",
      desc: "Track rank, solved count, and competitive progress.",
      href: "/leaderboard",
    },
    {
      icon: BrainCircuit,
      title: "AI Mentor",
      desc: "Get code explanations and improvement hints in Hinglish.",
      href: "/ai-mentor",
    },
    {
      icon: MessageSquareText,
      title: "Discussions",
      desc: "Discuss approaches, edge cases, and solution ideas.",
      href: "/problems",
    },
    {
      icon: ChartColumn,
      title: "Submission Analytics",
      desc: "See verdict patterns, weakness zones, and progress.",
      href: "/submission-analytics",
    },
    {
      icon: Bookmark,
      title: "Bookmarks & Notes",
      desc: "Save problems and keep your own notes per question.",
      href: "/dashboard",
    },
    {
      icon: Bot,
      title: "RAG Chat",
      desc: "Ask platform-aware questions and get contextual answers.",
      href: "/ai-chat",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="container py-12 md:py-16">
        <section className="rounded-[2rem] border border-border/70 bg-card/60 p-8 md:p-12">
          <h1 className="font-heading text-4xl font-black md:text-6xl">
            AlgoForge is not just problem solving.
            <span className="block text-muted-foreground">
              It is practice, feedback, ranking, roadmap, and guidance.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-8 text-muted-foreground md:text-base">
            A plain CRUD coding site is useless. Real product value comes from
            depth: analytics, discussions, AI help, roadmaps, bookmarks, notes,
            contests, and feedback loops.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="rounded-xl">
              <Link to="/problems">Start solving</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/leaderboard">Explore leaderboard</Link>
            </Button>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-3xl font-black">Core Features</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Link
                  key={feature.title}
                  to={feature.href}
                  className="rounded-[1.6rem] border border-border/70 bg-card/60 p-5 transition hover:border-primary/30 hover:bg-primary/5"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-4 text-xl font-bold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {feature.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h2 className="text-3xl font-black">Learning Paths</h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {paths.map((path) => (
              <div
                key={path.id}
                className="rounded-[1.6rem] border border-border/70 bg-card/60 p-5"
              >
                <h3 className="text-xl font-bold">{path.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {path.description || "Structured path to improve in a focused way."}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {path.items?.length || 0} problems
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}