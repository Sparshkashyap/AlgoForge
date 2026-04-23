import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { removeMyAvatarApi, uploadAvatarApi } from "@/api/user.api";

const DEFAULT_AVATAR_URL =
  "https://img.freepik.com/premium-vector/urban-monster-fusion-street-culture-fantasy_1230457-40156.jpg?semt=ais_hybrid&w=740&q=80";

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    currentAvatarUrl || DEFAULT_AVATAR_URL
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    setPreviewUrl(currentAvatarUrl || DEFAULT_AVATAR_URL);
  }, [currentAvatarUrl]);

  useEffect(() => {
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const openPicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please choose a JPG, PNG, or WEBP image");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const resetInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.info("Choose an image first");
      return;
    }

    try {
      setUploading(true);

      const response = await uploadAvatarApi(selectedFile);
      const nextAvatarUrl = response?.data?.avatarUrl || null;

      setSelectedFile(null);
      setPreviewUrl(nextAvatarUrl || DEFAULT_AVATAR_URL);
      onUpdated({ avatarUrl: nextAvatarUrl });

      resetInput();
      toast.success("Profile image updated");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to upload profile image"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    try {
      setRemoving(true);

      await removeMyAvatarApi();
      setSelectedFile(null);
      setPreviewUrl(DEFAULT_AVATAR_URL);
      onUpdated({ avatarUrl: null });

      resetInput();
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
          <div className="relative">
            <div className="h-32 w-32 overflow-hidden rounded-full border border-border/70 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
              <img
                src={previewUrl}
                alt={currentName || "Profile"}
                className="h-full w-full object-cover object-[center_20%]"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR_URL;
                }}
              />
            </div>

            <button
              type="button"
              onClick={openPicker}
              className="absolute bottom-1 right-1 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-primary text-primary-foreground shadow-lg transition hover:scale-105 hover:shadow-xl"
              aria-label="Change profile picture"
              title="Change profile picture"
            >
              <Camera className="h-5 w-5" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-primary" />
            <p className="font-semibold">Profile image</p>
          </div>

          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Click the camera icon to choose a new image and upload it. Supported
            formats: JPG, PNG, WEBP. Max size: 2MB.
          </p>

          {provider === "GOOGLE" || provider === "GITHUB" ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Your social avatar can be overridden here.
            </p>
          ) : null}

          {selectedFile ? (
            <div className="mt-4 rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm">
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB selected
              </p>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="rounded-xl"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload image"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleRemove}
              disabled={removing}
              className="rounded-xl"
            >
              {removing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove image
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}