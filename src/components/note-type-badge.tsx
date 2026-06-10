import { noteTypeConfig } from "@/data/mock-notes";
import { cn } from "@/lib/styles";
import { NoteType } from "@/types/note";

type NoteTypeBadgeProps = {
  type: NoteType;
};

export function NoteTypeBadge({ type }: NoteTypeBadgeProps) {
  const config = noteTypeConfig[type];

  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold", config.className)}>
      {config.label}
    </span>
  );
}
