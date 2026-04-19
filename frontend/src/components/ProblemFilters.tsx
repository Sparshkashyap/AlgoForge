import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  difficulty: string;
  setDifficulty: (value: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  allTags: string[];
};

export default function ProblemFilter({
  search,
  setSearch,
  difficulty,
  setDifficulty,
  selectedTags,
  setSelectedTags,
  allTags,
}: Props) {
  const [showTags, setShowTags] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearAll = () => {
    setSearch("");
    setDifficulty("");
    setSelectedTags([]);
  };

  return (
    <div className="rounded-[1.6rem] border border-border/70 bg-card/80 p-5 backdrop-blur-xl space-y-5">

      {/* 🔍 SEARCH */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search problems..."
          className="h-12 rounded-xl pl-11"
        />

        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      {/* 🎯 DIFFICULTY */}
      <div className="flex flex-wrap gap-2">
        {["Easy", "Medium", "Hard"].map((level) => (
          <button
            key={level}
            onClick={() =>
              setDifficulty(difficulty === level ? "" : level)
            }
            className={`rounded-full px-4 py-2 text-sm font-medium border transition ${
              difficulty === level
                ? "bg-primary text-white border-primary"
                : "border-border hover:border-primary/40"
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* 🏷 TAG TOGGLE */}
      <div>
        <button
          onClick={() => setShowTags((prev) => !prev)}
          className="text-sm text-primary font-medium"
        >
          {showTags ? "Hide Tags" : "Filter by Tags"}
        </button>

        {showTags && (
          <div className="mt-3 flex flex-wrap gap-2 max-h-[140px] overflow-y-auto">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`rounded-full px-3 py-1 text-xs border ${
                  selectedTags.includes(tag)
                    ? "bg-primary text-white border-primary"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ❌ CLEAR */}
      {(search || difficulty || selectedTags.length > 0) && (
        <div className="flex justify-end">
          <button
            onClick={clearAll}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}