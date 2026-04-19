import { useState } from "react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function BookmarkButton({
  isBookmarked = false,
  onToggle,
}: {
  isBookmarked?: boolean;
  onToggle?: (next: boolean) => Promise<void> | void;
}) {
  const [active, setActive] = useState(isBookmarked);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    try {
      setLoading(true);

      const next = !active;

      // optimistic UI
      setActive(next);

      if (onToggle) {
        await onToggle(next);
      }

      toast.success(
        next ? "Added to bookmarks" : "Removed from bookmarks"
      );
    } catch {
      // revert if failed
      setActive((prev) => !prev);
      toast.error("Failed to update bookmark");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleToggle}
      disabled={loading}
      className={`group relative h-10 rounded-xl px-4 text-sm font-medium transition ${
        active
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:text-foreground"
      }`}
    >
      <div className="flex items-center gap-2">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : active ? (
          <BookmarkCheck className="h-4 w-4" />
        ) : (
          <Bookmark className="h-4 w-4 group-hover:scale-110 transition" />
        )}

        {active ? "Saved" : "Save"}
      </div>
    </Button>
  );
}