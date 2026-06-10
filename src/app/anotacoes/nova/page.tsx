"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { noteTypeConfig } from "@/data/mock-notes";
import { useNotes } from "@/context/notes-context";
import { NoteType } from "@/types/note";

const noteTypes: NoteType[] = ["SIMPLE", "GUIDE", "COMPARISON", "SNIPPET", "ERROR_SOLUTION"];

export default function NewNotePage() {
  const router = useRouter();
  const { addNote, areas, categories, tags } = useNotes();
  const areaOptions = areas.filter((area) => area !== "Todas");
  const categoryOptions = categories.filter((category) => category !== "Todas");
  const suggestedTags = tags.filter((tag) => tag !== "Todas").slice(0, 10);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<NoteType>("SIMPLE");
  const [area, setArea] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !description.trim() || !content.trim() || !area || !category) {
      setError("Preencha título, resumo, conteúdo, área e categoria para criar a anotação simulada.");
      return;
    }

    const note = addNote({
      title,
      description,
      content,
      type,
      area,
      category,
      tags: selectedTags.length > 0 ? selectedTags : ["Geral"],
      isFavorite
    });

    router.push(`/anotacoes/${note.id}`);
  }

  function toggleTag(tag: string) {
    setSelectedTags((currentTags) =>
      currentTags.includes(tag) ? currentTags.filter((currentTag) => currentTag !== tag) : [...currentTags, tag]
    );
  }

  function addTypedTag() {
    const tag = tagInput.trim();

    if (!tag || selectedTags.includes(tag)) {
      setTagInput("");
      return;
    }

    setSelectedTags((currentTags) => [...currentTags, tag]);
    setTagInput("");
  }

  return (
    <div className="space-y-9">
      <PageHeader
        eyebrow="Nova anotação"
        title="Registrar aprendizado"
        description="Organize um novo aprendizado com título, resumo, tipo, área, categoria e tags."
      />

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-950">Conteúdo principal</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Estruture o aprendizado com título, resumo e conteúdo para facilitar a consulta depois.
            </p>
          </div>

          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-900">Título</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="h-12 rounded-lg border border-slate-300 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                placeholder="Ex: Fetch vs Axios"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-900">Resumo</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="min-h-24 rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                placeholder="Escreva uma descrição curta para encontrar essa anotação depois."
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-900">Conteúdo</span>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="min-h-72 rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                placeholder="Registre conceito, explicação, passos, exemplo prático, erro ou solução."
              />
            </label>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-base font-bold text-slate-950">Organização</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Campos visuais para mostrar como a anotação será classificada.</p>
            <div className="mt-4 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-900">Tipo</span>
                <select
                  value={type}
                  onChange={(event) => setType(event.target.value as NoteType)}
                  className="h-11 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                >
                  {noteTypes.map((type) => (
                    <option key={type} value={type}>
                      {noteTypeConfig[type].label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-900">Área</span>
                <select
                  value={area}
                  onChange={(event) => setArea(event.target.value)}
                  className="h-11 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  {areaOptions.map((area) => (
                    <option key={area}>{area}</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-900">Categoria</span>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="h-11 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  {categoryOptions.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-base font-bold text-slate-950">Tags sugeridas</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {suggestedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={
                    selectedTags.includes(tag)
                      ? "rounded-full bg-slate-950 px-3 py-1.5 text-xs font-bold text-white"
                      : "rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700"
                  }
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                className="h-10 min-w-0 flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                placeholder="Nova tag"
              />
              <button
                type="button"
                onClick={addTypedTag}
                className="h-10 rounded-lg border border-slate-300 px-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              >
                Adicionar
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <label className="flex items-center justify-between gap-4">
              <span>
                <span className="block text-sm font-bold text-slate-900">Marcar como favorito</span>
                <span className="block text-sm text-slate-600">Destaca a anotação nas consultas principais.</span>
              </span>
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(event) => setIsFavorite(event.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-slate-950 focus:ring-sky-500"
              />
            </label>

            {error ? (
              <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
                {error}
              </p>
            ) : null}

            <div className="mt-5 grid gap-3">
              <button
                type="submit"
                className="h-11 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white shadow-soft transition hover:bg-slate-800"
              >
                Salvar anotação
              </button>
              <button
                type="button"
                onClick={() => router.push("/anotacoes")}
                className="h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              >
                Cancelar
              </button>
            </div>
          </section>
        </aside>
      </form>
    </div>
  );
}
