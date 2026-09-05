"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createNoteAction,
  type CreateNoteActionResult,
  type CreateNoteField
} from "@/app/anotacoes/nova/actions";
import { PageHeader } from "@/components/page-header";
import { noteTypeConfig } from "@/config/note-type-config";
import type { NoteCreationCatalog } from "@/lib/notes/queries";
import type { NoteType } from "@/types/note";

const noteTypes = ["SIMPLE", "GUIDE", "SNIPPET", "ERROR_SOLUTION"] as const;

type FormErrors = Partial<Record<CreateNoteField, string>>;

type NewNoteFormProps = {
  catalog: NoteCreationCatalog;
};

export function NewNoteForm({ catalog }: NewNoteFormProps) {
  const router = useRouter();
  const submissionInProgress = useRef(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [type, setType] = useState<NoteType | "">("");
  const [areaId, setAreaId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedArea = useMemo(() => catalog.areas.find((area) => area.id === areaId), [areaId, catalog.areas]);
  const categoryOptions = selectedArea?.categories ?? [];
  const hasCreatableCatalog = catalog.areas.some((area) => area.categories.length > 0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submissionInProgress.current) {
      return;
    }

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0 || !isCreatableNoteType(type)) {
      setErrors(validationErrors);
      setSubmitError(null);
      return;
    }

    submissionInProgress.current = true;
    setIsSubmitting(true);
    setErrors({});
    setSubmitError(null);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("summary", summary);
    formData.set("content", content);
    formData.set("type", type);
    formData.set("areaId", areaId);
    formData.set("categoryId", categoryId);
    formData.set("favorite", String(isFavorite));
    selectedTagIds.forEach((tagId) => formData.append("tagIds", tagId));

    if (type === "SNIPPET") {
      formData.set("language", language);
      formData.set("code", code);
      formData.set("explanation", explanation);
    }

    let result: CreateNoteActionResult;

    try {
      result = await createNoteAction(formData);
    } catch {
      result = {
        success: false,
        message: "Não foi possível salvar a anotação agora. Tente novamente."
      };
    }

    if (result.success) {
      router.push(`/anotacoes/${encodeURIComponent(result.slug)}`);
      return;
    }

    setErrors(result.fieldErrors ?? {});
    setSubmitError(result.message);
    submissionInProgress.current = false;
    setIsSubmitting(false);
  }

  function validateForm() {
    const nextErrors: FormErrors = {};
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      nextErrors.title = "Informe um título para a anotação.";
    } else if (trimmedTitle.length < 3) {
      nextErrors.title = "Use um título com pelo menos 3 caracteres.";
    }

    if (!isCreatableNoteType(type)) {
      nextErrors.type = "Selecione o tipo da anotação.";
    }

    if (!areaId) {
      nextErrors.area = "Selecione uma área.";
    }

    if (!categoryId) {
      nextErrors.category = "Selecione uma categoria.";
    } else if (!categoryOptions.some((category) => category.id === categoryId)) {
      nextErrors.category = "Selecione uma categoria pertencente à área escolhida.";
    }

    if (type === "SNIPPET") {
      if (!language.trim()) {
        nextErrors.language = "Informe a linguagem do snippet.";
      }

      if (!code.trim()) {
        nextErrors.code = "Informe o código do snippet.";
      }
    } else if (!content.trim()) {
      nextErrors.content = "Informe o conteúdo da anotação.";
    }

    return nextErrors;
  }

  function clearFieldError(field: CreateNoteField) {
    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  function selectArea(nextAreaId: string) {
    setAreaId(nextAreaId);
    setCategoryId("");
    clearFieldError("area");
    clearFieldError("category");
  }

  function toggleTag(tagId: string) {
    setSelectedTagIds((currentTagIds) =>
      currentTagIds.includes(tagId)
        ? currentTagIds.filter((currentTagId) => currentTagId !== tagId)
        : [...currentTagIds, tagId]
    );
    clearFieldError("tags");
  }

  return (
    <div className="space-y-9">
      <PageHeader
        eyebrow="Nova anotação"
        title="Registrar aprendizado"
        description="Organize um novo aprendizado com título, resumo, tipo, área, categoria e tags."
      />

      {!hasCreatableCatalog ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
          Não há áreas com categorias disponíveis para criar uma anotação.
        </div>
      ) : null}

      <form onSubmit={handleSubmit} aria-busy={isSubmitting} className="grid gap-6 xl:grid-cols-[1fr_360px]">
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
                name="title"
                value={title}
                disabled={isSubmitting}
                onChange={(event) => {
                  setTitle(event.target.value);
                  clearFieldError("title");
                }}
                aria-invalid={Boolean(errors.title)}
                className={`h-12 rounded-lg border bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-70 ${
                  errors.title
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                    : "border-slate-300 focus:border-sky-500 focus:ring-sky-100"
                }`}
                placeholder="Ex: Conceitos fundamentais de APIs"
              />
              {errors.title ? <span className="text-sm font-semibold text-rose-700">{errors.title}</span> : null}
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-900">Resumo (opcional)</span>
              <textarea
                name="summary"
                value={summary}
                disabled={isSubmitting}
                onChange={(event) => {
                  setSummary(event.target.value);
                  clearFieldError("summary");
                }}
                aria-invalid={Boolean(errors.summary)}
                className={`min-h-24 rounded-lg border bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-70 ${
                  errors.summary
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                    : "border-slate-300 focus:border-sky-500 focus:ring-sky-100"
                }`}
                placeholder="Escreva uma descrição curta para encontrar essa anotação depois."
              />
              {errors.summary ? <span className="text-sm font-semibold text-rose-700">{errors.summary}</span> : null}
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-900">
                {type === "SNIPPET" ? "Conteúdo geral (opcional)" : "Conteúdo"}
              </span>
              <textarea
                name="content"
                value={content}
                disabled={isSubmitting}
                onChange={(event) => {
                  setContent(event.target.value);
                  clearFieldError("content");
                }}
                aria-invalid={Boolean(errors.content)}
                className={`min-h-72 rounded-lg border bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-70 ${
                  errors.content
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                    : "border-slate-300 focus:border-sky-500 focus:ring-sky-100"
                }`}
                placeholder="Registre conceito, explicação, passos, exemplo prático, erro ou solução."
              />
              {errors.content ? <span className="text-sm font-semibold text-rose-700">{errors.content}</span> : null}
            </label>

            {type === "SNIPPET" ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
                <h3 className="text-base font-bold text-amber-950">Código do snippet</h3>
                <p className="mt-1 text-sm leading-6 text-amber-900">
                  Informe a linguagem e preserve no código a formatação que deverá ser consultada depois.
                </p>

                <div className="mt-4 grid gap-5">
                  <label className="grid gap-2">
                    <span className="text-sm font-bold text-slate-900">Linguagem</span>
                    <input
                      name="language"
                      value={language}
                      disabled={isSubmitting}
                      onChange={(event) => {
                        setLanguage(event.target.value);
                        clearFieldError("language");
                      }}
                      aria-invalid={Boolean(errors.language)}
                      className={`h-12 rounded-lg border bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:ring-4 disabled:cursor-not-allowed disabled:opacity-70 ${
                        errors.language
                          ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                          : "border-amber-300 focus:border-amber-500 focus:ring-amber-100"
                      }`}
                      placeholder="Ex: TypeScript"
                    />
                    {errors.language ? (
                      <span className="text-sm font-semibold text-rose-700">{errors.language}</span>
                    ) : null}
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-bold text-slate-900">Código</span>
                    <textarea
                      name="code"
                      value={code}
                      disabled={isSubmitting}
                      onChange={(event) => {
                        setCode(event.target.value);
                        clearFieldError("code");
                      }}
                      aria-invalid={Boolean(errors.code)}
                      className={`min-h-64 rounded-lg border bg-slate-950 px-4 py-3 font-mono text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-500 focus:ring-4 disabled:cursor-not-allowed disabled:opacity-70 ${
                        errors.code
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
                          : "border-slate-700 focus:border-amber-500 focus:ring-amber-100"
                      }`}
                      placeholder="Cole ou escreva o código preservando a indentação."
                    />
                    {errors.code ? <span className="text-sm font-semibold text-rose-700">{errors.code}</span> : null}
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-bold text-slate-900">Explicação (opcional)</span>
                    <textarea
                      name="explanation"
                      value={explanation}
                      disabled={isSubmitting}
                      onChange={(event) => {
                        setExplanation(event.target.value);
                        clearFieldError("explanation");
                      }}
                      aria-invalid={Boolean(errors.explanation)}
                      className={`min-h-28 rounded-lg border bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:ring-4 disabled:cursor-not-allowed disabled:opacity-70 ${
                        errors.explanation
                          ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                          : "border-amber-300 focus:border-amber-500 focus:ring-amber-100"
                      }`}
                      placeholder="Registre quando usar ou o que este código resolve."
                    />
                    {errors.explanation ? (
                      <span className="text-sm font-semibold text-rose-700">{errors.explanation}</span>
                    ) : null}
                  </label>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-base font-bold text-slate-950">Organização</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Classifique a anotação usando o catálogo disponível.</p>
            <div className="mt-4 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-900">Tipo</span>
                <select
                  name="type"
                  value={type}
                  disabled={isSubmitting}
                  onChange={(event) => {
                    setType(event.target.value as NoteType);
                    clearFieldError("type");
                    clearFieldError("content");
                    clearFieldError("language");
                    clearFieldError("code");
                    clearFieldError("explanation");
                  }}
                  aria-invalid={Boolean(errors.type)}
                  className={`h-11 rounded-lg border bg-slate-50 px-3 text-sm outline-none focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-70 ${
                    errors.type
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                      : "border-slate-300 focus:border-sky-500 focus:ring-sky-100"
                  }`}
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  {noteTypes.map((noteType) => (
                    <option key={noteType} value={noteType}>
                      {noteTypeConfig[noteType].label}
                    </option>
                  ))}
                </select>
                {errors.type ? <span className="text-sm font-semibold text-rose-700">{errors.type}</span> : null}
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-900">Área</span>
                <select
                  name="areaId"
                  value={areaId}
                  disabled={isSubmitting || catalog.areas.length === 0}
                  onChange={(event) => selectArea(event.target.value)}
                  aria-invalid={Boolean(errors.area)}
                  className={`h-11 rounded-lg border bg-slate-50 px-3 text-sm outline-none focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-70 ${
                    errors.area
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                      : "border-slate-300 focus:border-sky-500 focus:ring-sky-100"
                  }`}
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  {catalog.areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
                {errors.area ? <span className="text-sm font-semibold text-rose-700">{errors.area}</span> : null}
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-900">Categoria</span>
                <select
                  name="categoryId"
                  value={categoryId}
                  disabled={isSubmitting || !areaId || categoryOptions.length === 0}
                  onChange={(event) => {
                    setCategoryId(event.target.value);
                    clearFieldError("category");
                  }}
                  aria-invalid={Boolean(errors.category)}
                  className={`h-11 rounded-lg border bg-slate-50 px-3 text-sm outline-none focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-70 ${
                    errors.category
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                      : "border-slate-300 focus:border-sky-500 focus:ring-sky-100"
                  }`}
                >
                  <option value="" disabled>
                    {areaId && categoryOptions.length === 0 ? "Nenhuma categoria disponível" : "Selecione"}
                  </option>
                  {categoryOptions.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category ? <span className="text-sm font-semibold text-rose-700">{errors.category}</span> : null}
              </label>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-base font-bold text-slate-950">Tags (opcional)</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Associe somente tags já disponíveis no catálogo.</p>
            {catalog.tags.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {catalog.tags.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id);

                  return (
                    <button
                      key={tag.id}
                      type="button"
                      disabled={isSubmitting}
                      aria-pressed={isSelected}
                      onClick={() => toggleTag(tag.id)}
                      className={
                        isSelected
                          ? "rounded-full bg-slate-950 px-3 py-1.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
                          : "rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
                      }
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-600">Nenhuma tag disponível no catálogo.</p>
            )}
            {errors.tags ? <p className="mt-3 text-sm font-semibold text-rose-700">{errors.tags}</p> : null}
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <label className="flex items-center justify-between gap-4">
              <span>
                <span className="block text-sm font-bold text-slate-900">Marcar como favorito</span>
                <span className="block text-sm text-slate-600">Destaca a anotação nas consultas principais.</span>
              </span>
              <input
                name="favorite"
                type="checkbox"
                checked={isFavorite}
                disabled={isSubmitting}
                onChange={(event) => setIsFavorite(event.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-slate-950 focus:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </label>

            {submitError ? (
              <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
                {submitError}
              </p>
            ) : Object.keys(errors).length > 0 ? (
              <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
                Revise os campos destacados antes de salvar.
              </p>
            ) : null}

            <div className="mt-5 grid gap-3">
              <button
                type="submit"
                disabled={isSubmitting || !hasCreatableCatalog}
                className="h-11 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white shadow-soft transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? "Salvando…" : "Salvar anotação"}
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => router.push("/anotacoes")}
                className="h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
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

function isCreatableNoteType(type: NoteType | ""): type is (typeof noteTypes)[number] {
  return noteTypes.some((noteType) => noteType === type);
}
