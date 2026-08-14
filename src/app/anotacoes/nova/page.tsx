import { NewNoteForm } from "@/components/anotacoes/new-note-form";
import { requireCurrentUser } from "@/lib/auth/session";
import { getNoteCreationCatalog } from "@/lib/notes/queries";

export default async function NewNotePage() {
  await requireCurrentUser();
  const catalog = await getNoteCreationCatalog();

  return <NewNoteForm catalog={catalog} />;
}
