import { noteTypeConfig } from "@/data/mock-notes";
import { cn } from "@/lib/styles";
import { NoteType } from "@/types/note";

type NoteTypeBadgeProps = {
  type: NoteType;
};

export function NoteTypeBadge({ type }: NoteTypeBadgeProps) {
  const config = noteTypeConfig[type];

  return (
    <span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold", config.className)}>
      {config.label}
    </span>
  );
}
