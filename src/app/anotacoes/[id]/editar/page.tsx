import { notFound } from "next/navigation";
import { EditNoteForm } from "@/components/anotacoes/edit-note-form";
import { requireCurrentUser } from "@/lib/auth/session";
import { getEditableNoteBySlug, getNoteCreationCatalog } from "@/lib/notes/queries";

export const dynamic = "force-dynamic";

type EditNotePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditNotePage({ params }: EditNotePageProps) {
  const currentUser = await requireCurrentUser();
  const { id } = await params;
  const [note, catalog] = await Promise.all([
    getEditableNoteBySlug(id, currentUser.id),
    getNoteCreationCatalog()
  ]);

  if (!note) {
    notFound();
  }

  return <EditNoteForm note={note} catalog={catalog} />;
}
