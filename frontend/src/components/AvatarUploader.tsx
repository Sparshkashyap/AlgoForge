import { useRef, useState } from "react";
import { uploadAvatarApi } from "@/api/user.api";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
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
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="h-20 w-20 overflow-hidden rounded-3xl border border-border bg-card">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile avatar"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            No photo
          </div>
        )}
      </div>

      <div>
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
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
              <Camera className="mr-2 h-4 w-4" />
              Upload Photo
            </>
          )}
        </Button>

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