# Fase 5D — Favoritos persistentes

Status: concluída funcionalmente.

## Objetivo

Substituir as ações rápidas locais de favorito por uma atualização real e persistente no PostgreSQL, preservando ownership, consistência entre as telas e o significado de `updatedAt`.

---

## Estado anterior

A Fase 5A já permitia definir e persistir o favorito inicial durante a criação de uma nota. A Fase 5B também persistia o checkbox de favorito quando o formulário completo de edição era salvo.

As ações rápidas existentes nos cards e no detalhe, porém, alteravam somente o estado local da interface. A Fase 5D fechou essa lacuna e passou a persistir essas interações no banco.

---

## Superfícies contempladas

As ações rápidas persistentes foram integradas às seguintes superfícies:

* `/`;
* `/dashboard`;
* `/anotacoes`;
* `/favoritos`;
* `/anotacoes/[id]`.

A rota `/anotacoes/[id]/editar` não recebeu um novo fluxo rápido de favorito. O formulário completo da Fase 5B continua persistindo seu checkbox pelo fluxo já existente e reflete o valor salvo pela ação rápida em uma nova navegação.

---

## Tipos contemplados

A atualização rápida de favorito atende todos os tipos de anotação existentes:

* `SIMPLE`;
* `GUIDE`;
* `ERROR_SOLUTION`;
* `SNIPPET`;
* `COMPARISON`.

Essa cobertura não inicia o CRUD estruturado de `SNIPPET` ou `COMPARISON`. Esses fluxos permanecem reservados, respectivamente, às Fases 5E e 5F e dependem da aprovação específica de suas regras funcionais.

---

## Mutation e segurança

O cliente envia somente:

* o slug da nota;
* o estado final desejado para `favorite`.

O servidor não executa um toggle baseado em estado possivelmente desatualizado. O `userId` é obtido exclusivamente por `requireCurrentUser()` e participa do `WHERE` da escrita junto com o slug.

O tipo não é recebido do cliente nem restringe a mutation. Nota inexistente e nota pertencente a outro usuário produzem o mesmo resultado controlado, sem revelar ownership. Depois da escrita, a mutation retorna somente o valor de favorito realmente persistido.

---

## Preservação de `updatedAt`

A ação rápida de favorito é tratada como atualização de metadado organizacional e não altera `updatedAt`.

Para preservar essa regra, foi usada uma atualização PostgreSQL estática e parametrizada que altera exclusivamente a coluna `favorite`. Slug, `userId` e o valor booleano são parâmetros; não há concatenação de valores controlados pelo cliente nem uso de APIs `Unsafe`.

A Fase 5D não exigiu alteração de schema ou migration. O salvamento pelo formulário completo da Fase 5B mantém seu comportamento existente e pode avançar `updatedAt`.

---

## Concorrência e interface

A interface segue uma estratégia pessimista: o estado visual do favorito muda somente depois da confirmação do servidor.

O controle de pending é feito por slug. Um `useRef` bloqueia imediatamente um segundo envio para a mesma nota, inclusive antes de um rerender, enquanto notas diferentes continuam interativas e podem ter requisições simultâneas.

Quando ocorre um erro, o estado visual anterior é preservado e somente o pending do slug concluído é removido. Não foram adicionadas store global, fila global, websocket ou sincronização em tempo real entre abas.

---

## Dashboard

`favoriteNotes` e `totalFavorites` deixaram de ser duplicados em estado local no dashboard. O Client Component usa diretamente os dados recebidos do Server Component.

Depois de desfavoritar uma nota, a revalidação recompõe a consulta com `take: 3`. Se existir um quarto favorito, ele passa a ocupar a vaga liberada, sem remoção manual incompleta e sem decremento local concorrente da métrica.

Não foi necessário adicionar `router.refresh()` nem uma `key` artificial para forçar remontagem.

---

## Revalidação

Depois da persistência confirmada, são consideradas as leituras de:

* `/`;
* `/dashboard`;
* `/anotacoes`;
* `/favoritos`;
* detalhe concreto em `/anotacoes/[id]`;
* edição concreta em `/anotacoes/[id]/editar`.

Uma falha posterior de revalidação é registrada separadamente e não transforma uma gravação já concluída em falsa falha de persistência.

`/areas` e `/tags` não são revalidadas, pois uma alteração exclusiva de favorito não modifica seus dados ou contagens.

---

## Validações executadas

Passaram:

* persistência de `favorite: true` e `favorite: false`;
* preservação do estado depois de reload;
* atualização rápida nos cinco tipos de anotação;
* manutenção de `updatedAt` com valor idêntico antes e depois da ação rápida;
* preservação dos dados estruturados de `SNIPPET` e `COMPARISON`;
* proteção de ownership;
* tratamento indistinguível de nota inexistente e nota externa;
* redirecionamento para `/login` quando a sessão está ausente;
* bloqueio de double click, produzindo apenas uma mutation para o mesmo slug;
* fluxo da home;
* dashboard com quatro favoritos e reposição do quarto item no conjunto limitado a três;
* listagem em `/anotacoes`;
* remoção persistente em `/favoritos`;
* detalhe em `/anotacoes/[id]`;
* reflexão do valor persistido na edição em uma nova navegação;
* regressões das Fases 5A, 5B e 5C;
* preservação das leituras de áreas e tags;
* `npm.cmd run type-check`;
* `npm.cmd run build`;
* `git diff --check`.

---

## Arquivos funcionais da fase

Criados:

* `src/app/anotacoes/favorite-actions.ts`;
* `src/hooks/use-note-favorite-mutation.ts`.

Alterados:

* `src/lib/notes/mutations.ts`;
* `src/components/note-card.tsx`;
* `src/components/home/home-client.tsx`;
* `src/components/dashboard/dashboard-client.tsx`;
* `src/components/anotacoes/anotacoes-list-client.tsx`;
* `src/components/favoritos/favorites-list-client.tsx`;
* `src/components/note-details-view.tsx`.

---

## Commit de implementação

```txt
f228a4f feat: implementa favoritos persistentes
```

Hash completo:

```txt
f228a4f58135b47637158b2d092c8ea0ce02297b
```

---

## Fora do escopo preservado

A Fase 5D não exigiu:

* alteração do schema Prisma;
* migration;
* alteração ou execução do seed;
* nova dependência;
* deploy ou preparação de produção;
* início da Fase 5E;
* início da Fase 5F;
* início da Fase 5G;
* início da Fase 5H.

O risco conhecido em `prisma/seed.ts`, que pode substituir o `passwordHash` da conta inicial por `null`, permanece como pendência separada. O seed continua intacto e não foi executado nesta fase.

---

## Estado final

A Fase 5D está funcionalmente concluída. Seu encerramento permanece condicionado somente ao commit desta documentação e à publicação do commit funcional e do commit documental.

A próxima subfase é a Fase 5E — CRUD estruturado de `SNIPPET`, que exige revisão e aprovação específica de suas regras funcionais antes do planejamento ou da implementação.
