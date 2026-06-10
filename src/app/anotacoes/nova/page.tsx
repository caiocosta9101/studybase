"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { noteTypeConfig } from "@/data/mock-notes";
import { useNotes } from "@/context/notes-context";
import { NoteType } from "@/types/note";

const noteTypes: NoteType[] = ["SIMPLE", "GUIDE", "COMPARISON", "SNIPPET", "ERROR_SOLUTION"];

type FormErrors = Partial<Record<"title" | "type" | "area" | "category" | "content", string>>;

export default function NewNotePage() {
  const router = useRouter();
  const { addNote, areas, categories, tags } = useNotes();
  const areaOptions = areas.filter((area) => area !== "Todas");
  const categoryOptions = categories.filter((category) => category !== "Todas");
  const suggestedTags = tags.filter((tag) => tag !== "Todas").slice(0, 10);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<NoteType | "">("");
  const [area, setArea] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0 || !type) {
      setErrors(validationErrors);
      return;
    }

    const note = addNote({
      title: title.trim(),
      description: description.trim() || content.trim().slice(0, 160),
      content: content.trim() || description.trim(),
      type,
      area,
      category,
      tags: selectedTags.length > 0 ? selectedTags : ["Geral"],
      isFavorite
    });

    router.push(`/anotacoes/${note.id}`);
  }

  function validateForm() {
    const nextErrors: FormErrors = {};
    const trimmedTitle = title.trim();
    const hasDescriptionOrContent = Boolean(description.trim() || content.trim());

    if (!trimmedTitle) {
      nextErrors.title = "Informe um título para a anotação.";
    } else if (trimmedTitle.length < 3) {
      nextErrors.title = "Use um título com pelo menos 3 caracteres.";
    }

    if (!type) {
      nextErrors.type = "Selecione o tipo da anotação.";
    }

    if (!area) {
      nextErrors.area = "Selecione uma área.";
    }

    if (!category) {
      nextErrors.category = "Selecione uma categoria.";
    }

    if (!hasDescriptionOrContent) {
      nextErrors.content = "Informe um resumo ou um conteúdo para evitar uma anotação vazia.";
    }

    return nextErrors;
  }

  function clearFieldError(field: keyof FormErrors) {
    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
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
                onChange={(event) => {
                  setTitle(event.target.value);
                  clearFieldError("title");
                }}
                aria-invalid={Boolean(errors.title)}
                className={`h-12 rounded-lg border bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                  errors.title
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                    : "border-slate-300 focus:border-sky-500 focus:ring-sky-100"
                }`}
                placeholder="Ex: Fetch vs Axios"
              />
              {errors.title ? <span className="text-sm font-semibold text-rose-700">{errors.title}</span> : null}
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-900">Resumo</span>
              <textarea
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  clearFieldError("content");
                }}
                aria-invalid={Boolean(errors.content)}
                className={`min-h-24 rounded-lg border bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                  errors.content
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                    : "border-slate-300 focus:border-sky-500 focus:ring-sky-100"
                }`}
                placeholder="Escreva uma descrição curta para encontrar essa anotação depois."
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-900">Conteúdo</span>
              <textarea
                value={content}
                onChange={(event) => {
                  setContent(event.target.value);
                  clearFieldError("content");
                }}
                aria-invalid={Boolean(errors.content)}
                className={`min-h-72 rounded-lg border bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                  errors.content
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                    : "border-slate-300 focus:border-sky-500 focus:ring-sky-100"
                }`}
                placeholder="Registre conceito, explicação, passos, exemplo prático, erro ou solução."
              />
              {errors.content ? <span className="text-sm font-semibold text-rose-700">{errors.content}</span> : null}
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
                  onChange={(event) => {
                    setType(event.target.value as NoteType);
                    clearFieldError("type");
                  }}
                  aria-invalid={Boolean(errors.type)}
                  className={`h-11 rounded-lg border bg-slate-50 px-3 text-sm outline-none focus:bg-white focus:ring-4 ${
                    errors.type
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                      : "border-slate-300 focus:border-sky-500 focus:ring-sky-100"
                  }`}
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  {noteTypes.map((type) => (
                    <option key={type} value={type}>
                      {noteTypeConfig[type].label}
                    </option>
                  ))}
                </select>
                {errors.type ? <span className="text-sm font-semibold text-rose-700">{errors.type}</span> : null}
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-900">Área</span>
                <select
                  value={area}
                  onChange={(event) => {
                    setArea(event.target.value);
                    clearFieldError("area");
                  }}
                  aria-invalid={Boolean(errors.area)}
                  className={`h-11 rounded-lg border bg-slate-50 px-3 text-sm outline-none focus:bg-white focus:ring-4 ${
                    errors.area
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                      : "border-slate-300 focus:border-sky-500 focus:ring-sky-100"
                  }`}
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  {areaOptions.map((area) => (
                    <option key={area}>{area}</option>
                  ))}
                </select>
                {errors.area ? <span className="text-sm font-semibold text-rose-700">{errors.area}</span> : null}
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-900">Categoria</span>
                <select
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value);
                    clearFieldError("category");
                  }}
                  aria-invalid={Boolean(errors.category)}
                  className={`h-11 rounded-lg border bg-slate-50 px-3 text-sm outline-none focus:bg-white focus:ring-4 ${
                    errors.category
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                      : "border-slate-300 focus:border-sky-500 focus:ring-sky-100"
                  }`}
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  {categoryOptions.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
                {errors.category ? <span className="text-sm font-semibold text-rose-700">{errors.category}</span> : null}
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

            {Object.keys(errors).length > 0 ? (
              <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
                Revise os campos destacados antes de salvar.
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
