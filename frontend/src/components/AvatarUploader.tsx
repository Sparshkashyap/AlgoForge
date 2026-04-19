import { useMemo, useRef, useState } from "react";
import { uploadAvatarApi } from "@/api/user.api";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, Sparkles, UploadCloud } from "lucide-react";
import { toast } from "react-toastify";

export default function AvatarUploader({
  avatarUrl,
  onUploaded,
}: {
  avatarUrl?: string | null;
  onUploaded: (nextUrl: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const hasAvatar = useMemo(() => !!avatarUrl, [avatarUrl]);

  const handlePick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const data = await uploadAvatarApi(file);
      onUploaded(data.data.avatarUrl);
      toast.success("Photo uploaded successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <div className="relative">
        <div className="h-24 w-24 overflow-hidden rounded-[1.6rem] border border-border/70 bg-gradient-to-br from-primary/10 to-accent/10 shadow-[0_14px_34px_rgba(0,0,0,0.12)]">
          {hasAvatar ? (
            <img
              src={avatarUrl || ""}
              alt="Profile avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-center">
              <Camera className="h-5 w-5 text-primary" />
              <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                No photo
              </span>
            </div>
          )}
        </div>

        <div className="absolute -bottom-2 -right-2 rounded-full border border-border/70 bg-card/90 p-2 shadow-[0_10px_24px_rgba(0,0,0,0.12)] backdrop-blur-xl">
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <Sparkles className="h-4 w-4 text-primary" />
          )}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">Profile photo</p>
        <p className="mt-1 text-sm leading-7 text-muted-foreground">
          Upload a clean square image for best results across profile and account surfaces.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border-border/70 bg-background/60"
            onClick={handlePick}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" />
                {hasAvatar ? "Replace Photo" : "Upload Photo"}
              </>
            )}
          </Button>

          <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            JPG, PNG, WebP
          </span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}