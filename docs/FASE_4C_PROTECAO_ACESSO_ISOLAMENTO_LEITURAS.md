# Fase 4C — Proteção de acesso e leituras isoladas por usuário

Status: concluída.

## Objetivo

Exigir uma sessão válida nas rotas internas do StudyBase e garantir que todas as leituras reais retornem somente dados relacionados ao usuário autenticado.

---

## Contexto anterior

A Fase 4B implementou login, logout e sessão stateless em cookie assinado, mas manteve deliberadamente as rotas públicas e as consultas sem filtro por usuário. A Fase 4C utilizou essa infraestrutura para adicionar autorização server-side e isolamento das leituras.

---

## Decisões aprovadas

* reutilizar a sessão existente sem alterar cookie, assinatura, versão ou duração;
* proteger as rotas diretamente no servidor, sem depender apenas de layout ou navegação visual;
* não introduzir `proxy.ts` ou middleware legado;
* passar o `userId` explicitamente das Server Pages para as consultas;
* manter `Area`, `Category` e `Tag` como entidades globais no schema;
* retornar `404` tanto para nota inexistente quanto para nota pertencente a outro usuário;
* manter `/anotacoes/nova` com criação mockada e sem persistência Prisma;
* não alterar schema, migration, seed, dependências ou variáveis de ambiente.

---

## Guarda de acesso

Foi adicionada `requireCurrentUser` em `src/lib/auth/session.ts`. A função reutiliza `getCurrentUser`, redireciona para `/login` quando não existe usuário válido e devolve o usuário autenticado quando a sessão é aceita.

As seguintes rotas passaram a exigir usuário autenticado no servidor:

* `/`;
* `/dashboard`;
* `/anotacoes`;
* `/anotacoes/[id]`;
* `/favoritos`;
* `/areas`;
* `/tags`;
* `/anotacoes/nova`;
* `/configuracoes`.

`/login` permanece pública e continua redirecionando uma sessão válida para `/dashboard`.

---

## Isolamento das leituras

`src/lib/notes/queries.ts` foi marcado como `server-only`. Suas nove funções reais de leitura passaram a exigir `userId` explicitamente:

* `getNotesForList`;
* `getFavoriteNotes`;
* `getHomeData`;
* `getAreaSummaries`;
* `getAreaNameBySlug`;
* `getTagSummaries`;
* `getTagNameBySlug`;
* `getNoteBySlug`;
* `getDashboardData`.

Notas, favoritos, métricas, contagens, notas recentes e agregações por tipo são filtrados pelo usuário autenticado. Notas com `userId = null` não participam das leituras privadas.

Áreas, categorias e tags continuam globais no schema. Entretanto, somente são apresentadas quando relacionadas a notas do usuário atual, e seus `_count`, contagens e agregações também usam o mesmo filtro de ownership.

---

## Proteção do detalhe de nota

`getNoteBySlug` deixou de consultar apenas o `slug` e passou a exigir simultaneamente `slug` e `userId` por meio de `findFirst`.

Quando essa combinação não existe, a função retorna `null` e a página mantém `notFound()`. Dessa forma, nota inexistente e nota pertencente a outro usuário seguem o mesmo caminho de `404`, sem consulta adicional que confirme a existência do recurso.

---

## Nova anotação

`src/app/anotacoes/nova/page.tsx` foi transformada em Server Page protegida. O formulário e seu estado React foram movidos para `src/components/anotacoes/new-note-form.tsx`, que permanece como Client Component.

Foram preservados:

* `useNotes` e `addNote`;
* estado local;
* validações existentes;
* navegação;
* aparência;
* criação simulada sem escrita no banco.

O Client Component não importa sessão, Prisma ou outro código exclusivo do servidor.

---

## Validações técnicas

Passaram:

* `npm.cmd run type-check`;
* `npm.cmd run build`;
* `git diff --check`;
* revisão completa do diff de segurança;
* auditoria das queries, contagens, `_count`, `groupBy` e fronteiras entre Server e Client Components.

O build confirmou que as rotas internas protegidas são renderizadas dinamicamente no servidor.

---

## Validações runtime

Foram validados:

* acesso autenticado a todas as rotas internas protegidas;
* abertura de uma nota própria existente;
* `/login` com sessão válida redirecionando para `/dashboard`;
* logout pelo botão "Sair";
* acesso direto a todas as rotas protegidas depois do logout redirecionando para `/login`;
* slug claramente inexistente retornando `404` sem erro 500;
* `/anotacoes/nova` renderizando normalmente após a separação Server/Client;
* validações do formulário de nova anotação;
* botão "Cancelar" retornando para `/anotacoes`;
* ausência de erro de console relacionado à Fase 4C.

Nenhuma nova anotação foi salva e nenhum registro foi criado ou alterado durante a validação.

---

## Ressalva conhecida

O isolamento horizontal entre dois usuários reais não foi testado em runtime porque isso exigiria criar um segundo usuário e dados adicionais.

A proteção foi validada por revisão do código, TypeScript, build, filtros obrigatórios por `userId` e uso conjunto de `slug` e `userId`. Essa ressalva não representa falha da Fase 4C.

---

## Commit de implementação

```txt
9bc1a37 feat: protege rotas e isola leituras por usuario
```

---

## Fora do escopo

* cadastro;
* recuperação ou troca de senha;
* CRUD real;
* persistência real de favoritos;
* schema Prisma e migrations;
* seed e correção do risco conhecido no seed;
* tabela de sessões e revogação individual;
* rate limiting;
* novas dependências ou variáveis de ambiente;
* IA e API pública.

---

## Situação posterior

A Fase 4D implementou o cadastro público de usuário e validou em runtime o isolamento horizontal com uma conta nova sem dados próprios. Com isso, as Fases 4A–4D foram concluídas e publicadas.
