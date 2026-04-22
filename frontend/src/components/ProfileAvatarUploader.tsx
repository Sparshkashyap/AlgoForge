import { useMemo, useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { removeMyAvatarApi, updateMyProfileApi } from "@/api/user.api";

type Props = {
  currentName?: string;
  currentAvatarUrl?: string | null;
  provider?: string;
  onUpdated: (next: { avatarUrl: string | null }) => void;
};

export default function ProfileAvatarUploader({
  currentName,
  currentAvatarUrl,
  provider,
  onUpdated,
}: Props) {
  const [avatarUrlInput, setAvatarUrlInput] = useState(currentAvatarUrl || "");
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);

  const fallbackLetter = useMemo(() => {
    return (currentName || "U").trim().charAt(0).toUpperCase();
  }, [currentName]);

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await updateMyProfileApi({
        avatarUrl: avatarUrlInput.trim(),
      });

      onUpdated({
        avatarUrl: response?.data?.avatarUrl || avatarUrlInput.trim() || null,
      });

      toast.success("Profile image updated");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to update image");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    try {
      setRemoving(true);

      await removeMyAvatarApi();
      setAvatarUrlInput("");
      onUpdated({ avatarUrl: null });

      toast.success("Profile image removed");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to remove image");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="rounded-[1.6rem] border border-border/70 bg-card/70 p-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-start">
        <div className="shrink-0">
          {currentAvatarUrl ? (
            <img
              src={currentAvatarUrl}
              alt={currentName || "Profile"}
              className="h-28 w-28 rounded-full border border-border/70 object-cover object-center"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-border/70 bg-background text-3xl font-black text-primary">
              {fallbackLetter}
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-primary" />
            <p className="font-semibold">Profile image</p>
          </div>

          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {provider === "GOOGLE" || provider === "GITHUB"
              ? "You can override your social login avatar with your own image URL."
              : "Add or update your profile image using a valid image URL."}
          </p>

          <input
            type="url"
            value={avatarUrlInput}
            onChange={(e) => setAvatarUrlInput(e.target.value)}
            placeholder="https://your-image-url.com/avatar.jpg"
            className="mt-4 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none"
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl"
            >
              {saving ? "Saving..." : "Save image"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleRemove}
              disabled={removing}
              className="rounded-xl"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {removing ? "Removing..." : "Remove image"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}