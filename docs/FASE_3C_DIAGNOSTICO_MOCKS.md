# Fase 3C — Diagnóstico dos mocks

## Resumo

O projeto ainda usa dados mockados no front-end. A origem principal está em `src/data/mock-notes.ts`, e o estado da aplicação é gerenciado em `src/context/notes-context.tsx`.

## Arquivos principais

- `src/data/mock-notes.ts`
- `src/types/note.ts`
- `src/context/notes-context.tsx`
- `src/app/anotacoes/[id]/page.tsx`
- `src/components/note-type-badge.tsx`
- `src/app/anotacoes/nova/page.tsx`

## Telas dependentes

- `/`
- `/dashboard`
- `/anotacoes`
- `/anotacoes/[id]`
- `/anotacoes/nova`
- `/favoritos`
- `/areas`
- `/tags`

## Funcionalidades dependentes dos mocks

- listagem;
- detalhes;
- busca;
- filtros;
- favoritos;
- criação simulada;
- áreas;
- tags;
- resumo por tipo;
- comparação;
- snippet;
- erro/solução.

## Correspondência inicial com o Prisma

- `title` → `Note.title`
- `description` → `Note.summary`
- `content` → `Note.content`
- `type` → `Note.type`
- `isFavorite` → `Note.favorite`
- `area`, `category`, `tags` → relações com `Area`, `Category` e `Tag`
- `code` → `Snippet.code`
- `comparison` → `Comparison` e `ComparisonOption`

## Pontos a decidir

- A rota de detalhes deve usar `slug` ou `id`.
- Alguns campos da UI são derivados, como `typeLabel`, `readingTime`, `updatedAt` formatado e `highlights`.
- `solution` não existe como campo próprio no schema.
- `comparison[].points` não bate exatamente com `ComparisonOption`.
- O contexto atual é client-side, mas Prisma deve rodar no servidor.

## Seed

O seed atual cobre o essencial para testar leitura real:

- usuário fake;
- áreas;
- categorias;
- tags;
- notas de tipos diferentes;
- favoritos;
- comparação;
- snippet;
- erro/solução.

Não precisa cobrir exatamente todos os exemplos dos mocks para iniciar a leitura real.

## Primeira integração recomendada

A primeira tela recomendada para integração real é:

`/anotacoes`

A implementação futura deve começar apenas pela listagem em modo leitura.

## Fora do escopo

- CRUD real;
- autenticação;
- IA;
- rotas de API sem aprovação;
- favoritos reais;
- criação real;
- edição real;
- exclusão real.