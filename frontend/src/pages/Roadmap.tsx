import { motion } from "framer-motion";
import {
  BrainCircuit,
  Target,
  Trophy,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

const roadmap = [
  {
    title: "Foundation",
    icon: Target,
    points: [
      "Arrays & Strings",
      "Basic Math & Logic",
      "Time & Space Complexity",
    ],
  },
  {
    title: "Core DSA",
    icon: BrainCircuit,
    points: [
      "Linked List",
      "Stack & Queue",
      "Recursion & Backtracking",
      "Binary Search",
    ],
  },
  {
    title: "Intermediate",
    icon: Sparkles,
    points: [
      "Trees & BST",
      "Heaps & Priority Queue",
      "Greedy Algorithms",
      "Sliding Window",
    ],
  },
  {
    title: "Advanced",
    icon: Trophy,
    points: [
      "Graphs (BFS/DFS)",
      "Dynamic Programming",
      "Tries",
      "Segment Trees",
    ],
  },
];

export default function Roadmap() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-10">
        <div className="max-w-3xl">
          <h1 className="font-heading text-4xl font-bold">
            Interview Roadmap
          </h1>
          <p className="mt-3 text-muted-foreground">
            Stop randomly solving problems. Follow a structured path and build
            real problem-solving ability step by step.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {roadmap.map((section, index) => {
            const Icon = section.icon;

            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className="rounded-3xl border border-border bg-card p-6"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">
                    {section.title}
                  </h2>
                </div>

                <div className="mt-5 space-y-3">
                  {section.points.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}