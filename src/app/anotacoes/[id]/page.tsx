import { NoteDetailsView } from "@/components/note-details-view";
import { mockNotes } from "@/data/mock-notes";

type NoteDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return mockNotes.map((note) => ({
    id: note.id
  }));
}

export default async function NoteDetailsPage({ params }: NoteDetailsPageProps) {
  const { id } = await params;

  return <NoteDetailsView id={id} />;
}
