# Fase 5A — Criação real de anotações básicas

Status: concluída.

## Objetivo

Substituir a criação mockada por criação real e persistida para os tipos:

* `SIMPLE`;
* `GUIDE`;
* `ERROR_SOLUTION`.

`ERROR_SOLUTION` utiliza os campos comuns de `Note` e conteúdo livre nesta subfase.

---

## Entregas

Foram implementados:

* Server Action autenticada para receber e validar a criação;
* mutation Prisma restrita ao servidor;
* catálogo global real de áreas, categorias e tags;
* validações decisivas no servidor;
* ownership obtido exclusivamente da sessão autenticada;
* persistência atômica de `Note` e `NoteTag` em transação;
* validação de existência da área e de pertencimento da categoria à área selecionada;
* associação opcional somente de tags globais existentes;
* remoção do fallback mockado `"Geral"`;
* favorito inicial opcional e persistido;
* geração de slug pelo sistema, com tratamento específico e limitado de colisões;
* estado mínimo de loading, bloqueio de submissão duplicada e mensagens controladas de erro;
* revalidação das leituras afetadas somente depois da persistência confirmada;
* remoção do fluxo mockado de criação, do `NotesProvider` e dos mocks sem consumidores.

Somente `SIMPLE`, `GUIDE` e `ERROR_SOLUTION` são aceitos para criação no cliente e no servidor.

---

## Arquivos principais

Criados:

* `src/app/anotacoes/nova/actions.ts`;
* `src/lib/notes/mutations.ts`.

Alterados:

* `src/app/anotacoes/nova/page.tsx`;
* `src/components/anotacoes/new-note-form.tsx`;
* `src/components/app-shell.tsx`;
* `src/lib/notes/queries.ts`.

Removidos:

* `src/context/notes-context.tsx`;
* `src/data/mock-notes.ts`.

---

## Validações

Passaram:

* `npm.cmd run type-check`;
* `npm.cmd run build`;
* `git diff --check`;
* revisão estática completa da separação entre servidor e cliente;
* testes manuais autenticados do fluxo real de criação.

Os testes manuais confirmaram:

* rejeição de título com menos de três caracteres;
* obrigatoriedade do conteúdo;
* criação e persistência real de `SIMPLE` no PostgreSQL;
* persistência após recarregar a página;
* gravação correta de `userId`, `areaId` e `categoryId` em `Note`;
* associação real de tag em `NoteTag`;
* persistência do favorito inicial;
* atualização das leituras em `/tags` e `/favoritos`;
* criação e persistência de `GUIDE`;
* criação e persistência de `ERROR_SOLUTION` com conteúdo livre;
* prevenção de criação duplicada durante o envio.

---

## Limites da Fase 5A

Permanecem fora desta subfase:

* edição real de anotações básicas — Fase 5B;
* exclusão real e fechamento do CRUD básico — Fase 5C;
* persistência de favoritos em todas as ações rápidas — Fase 5D;
* CRUD estruturado de `SNIPPET` — Fase 5E, condicionado à aprovação específica de suas regras funcionais;
* CRUD estruturado de `COMPARISON` — Fase 5F, condicionado à aprovação específica de suas regras funcionais;
* refinamento amplo de busca e filtros — Fase 5G;
* fechamento amplo de estados, consistência visual e UX — Fase 5H;
* produção e deploy.

Notas existentes dos tipos `SNIPPET` e `COMPARISON` continuam legíveis, e seus dados estruturados não foram removidos ou transformados.

---

## Alterações estruturais não realizadas

A Fase 5A não exigiu:

* alteração do schema Prisma;
* migration;
* alteração ou execução do seed;
* nova dependência;
* nova variável de ambiente;
* API pública.

---

## Commit de implementação

```txt
4761324 feat: implementa criacao real de anotacoes
```
