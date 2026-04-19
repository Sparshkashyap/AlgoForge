import { useState } from "react";
import { Calendar, Clock, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

type ContestFormData = {
  title: string;
  startTime: string;
  durationMinutes: number;
  maxParticipants?: number;
};

export default function ContestForm({
  initialData,
  onSubmit,
}: {
  initialData?: ContestFormData;
  onSubmit?: (data: ContestFormData) => Promise<void> | void;
}) {
  const [form, setForm] = useState<ContestFormData>({
    title: initialData?.title || "",
    startTime: initialData?.startTime || "",
    durationMinutes: initialData?.durationMinutes || 60,
    maxParticipants: initialData?.maxParticipants || undefined,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof ContestFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Contest title is required");
      return;
    }

    if (!form.startTime) {
      toast.error("Start time is required");
      return;
    }

    if (!form.durationMinutes || form.durationMinutes <= 0) {
      toast.error("Duration must be valid");
      return;
    }

    try {
      setLoading(true);
      await onSubmit?.(form);
      toast.success("Contest saved successfully");
    } catch {
      toast.error("Failed to save contest");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-[1.8rem] border border-border/70 bg-card/90 p-6 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-primary/20 bg-primary/10 text-primary">
          <Trophy className="h-5 w-5" />
        </div>

        <div>
          <h3 className="font-heading text-xl font-black">
            Create Contest
          </h3>
          <p className="text-sm text-muted-foreground">
            Define contest schedule and participation rules
          </p>
        </div>
      </div>

      {/* TITLE */}
      <div>
        <label className="text-sm font-medium">Contest Title</label>
        <Input
          className="mt-2 h-12 rounded-xl"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Weekly Coding Contest"
        />
      </div>

      {/* START TIME */}
      <div>
        <label className="text-sm font-medium">Start Time</label>
        <div className="relative mt-2">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="datetime-local"
            className="h-12 rounded-xl pl-10"
            value={form.startTime}
            onChange={(e) => handleChange("startTime", e.target.value)}
          />
        </div>
      </div>

      {/* DURATION */}
      <div>
        <label className="text-sm font-medium">Duration (minutes)</label>
        <div className="relative mt-2">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="number"
            className="h-12 rounded-xl pl-10"
            value={form.durationMinutes}
            onChange={(e) =>
              handleChange("durationMinutes", Number(e.target.value))
            }
          />
        </div>
      </div>

      {/* PARTICIPANTS */}
      <div>
        <label className="text-sm font-medium">
          Max Participants (optional)
        </label>
        <div className="relative mt-2">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="number"
            className="h-12 rounded-xl pl-10"
            value={form.maxParticipants || ""}
            onChange={(e) =>
              handleChange(
                "maxParticipants",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            placeholder="Unlimited"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl h-12 text-sm font-semibold"
      >
        {loading ? "Saving..." : "Create Contest"}
      </Button>
    </form>
  );
}