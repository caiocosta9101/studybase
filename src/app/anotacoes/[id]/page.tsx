import { notFound } from "next/navigation";
import { NoteDetailsView } from "@/components/note-details-view";
import { requireCurrentUser } from "@/lib/auth/session";
import { getNoteBySlug } from "@/lib/notes/queries";

export const dynamic = "force-dynamic";

type NoteDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NoteDetailsPage({ params }: NoteDetailsPageProps) {
  const currentUser = await requireCurrentUser();
  const { id } = await params;
  const note = await getNoteBySlug(id, currentUser.id);

  if (!note) {
    notFound();
  }

  return <NoteDetailsView note={note} />;
}
