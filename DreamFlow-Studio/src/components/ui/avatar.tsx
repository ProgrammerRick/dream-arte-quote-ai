import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Avatar({
  name,
  color = "#7c3aed",
  size = 40,
  className,
}: {
  name: string;
  color?: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("flex shrink-0 items-center justify-center rounded-full font-display font-semibold text-white", className)}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
      }}
    >
      {getInitials(name)}
    </div>
  );
}
