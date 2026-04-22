import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "@/api/axios";
import { Navbar } from "@/components/Navbar";

export default function ContestRanking() {
  const { contestId = "" } = useParams();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    API.get(`/contests/${contestId}/ranking`).then((res) => {
      setItems(res.data.data || []);
    });
  }, [contestId]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-10">
        <h1 className="text-3xl font-bold">Contest Ranking</h1>

        <div className="mt-6 space-y-3">
          {items.map((item, index) => (
            <div
              key={item.userId}
              className="rounded-xl border border-border p-4 flex justify-between"
            >
              <span>
                #{index + 1} {item.name}
              </span>
              <span>
                Solved: {item.solved} | Score: {item.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}