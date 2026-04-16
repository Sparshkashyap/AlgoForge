import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { getDailyQuestionApi } from "@/api/user.api";
import DailyQuestionCard from "@/components/DailyQuestionCard";

export default function DailyQuestion() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getDailyQuestionApi().then((res) => setData(res.data));
  }, []);

  if (!data?.daily) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-10 text-muted-foreground">
          Loading daily question...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10">
        <DailyQuestionCard
          title={data.daily.problem.title}
          slug={data.daily.problem.slug}
          status={data.myAttempt?.status || null}
        />
      </div>
    </div>
  );
}