type Props = {
  name?: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizeMap = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-14 w-14 text-lg",
  xl: "h-24 w-24 text-2xl",
};

export default function UserAvatar({
  name = "U",
  avatarUrl,
  size = "md",
  className = "",
}: Props) {
  const letter = name.trim().charAt(0).toUpperCase();

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizeMap[size]} rounded-full object-cover object-center border border-border/70 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeMap[size]} flex items-center justify-center rounded-full border border-border/70 bg-background font-black text-primary ${className}`}
    >
      {letter}
    </div>
  );
}