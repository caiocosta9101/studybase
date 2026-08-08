import { NewNoteForm } from "@/components/anotacoes/new-note-form";
import { requireCurrentUser } from "@/lib/auth/session";

export default async function NewNotePage() {
  await requireCurrentUser();

  return <NewNoteForm />;
}
