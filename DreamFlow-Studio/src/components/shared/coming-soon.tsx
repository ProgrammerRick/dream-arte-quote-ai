import type { LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";

export function ComingSoonPage({
  eyebrow,
  title,
  description,
  icon,
  emptyTitle,
  emptyDescription,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={<Badge tone="brand">Em desenvolvimento</Badge>}
      />
      <EmptyState icon={icon} title={emptyTitle} description={emptyDescription} className="min-h-[50vh]" />
    </div>
  );
}
