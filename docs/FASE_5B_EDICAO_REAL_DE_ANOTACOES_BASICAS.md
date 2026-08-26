# Fase 5B — Edição real de anotações básicas

Status: concluída.

## Objetivo

Implementar a edição real e persistente das notas básicas pertencentes ao usuário autenticado, preservando o ownership, o tipo e o slug já definidos.

Os tipos atendidos nesta subfase são:

* `SIMPLE`;
* `GUIDE`;
* `ERROR_SOLUTION`.

---

## Escopo implementado

Foram implementados:

* rota protegida `/anotacoes/[id]/editar`;
* formulário preenchido com os dados persistidos da nota;
* botão "Editar" no detalhe dos tipos básicos permitidos;
* leitura específica dos dados brutos necessários para edição;
* Server Action autenticada com validações server-side;
* mutation Prisma restrita ao servidor;
* edição de título, resumo, conteúdo, área, categoria, tags e favorito;
* substituição integral das tags selecionadas;
* persistência atômica da nota e de suas relações com tags;
* revalidação das leituras afetadas depois do salvamento confirmado;
* retorno ao detalhe da nota usando o mesmo slug.

---

## Arquivos principais

Criados:

* `src/app/anotacoes/[id]/editar/page.tsx`;
* `src/app/anotacoes/[id]/editar/actions.ts`;
* `src/components/anotacoes/edit-note-form.tsx`.

Alterados:

* `src/lib/notes/queries.ts`;
* `src/lib/notes/mutations.ts`;
* `src/components/note-details-view.tsx`.

---

## Regras preservadas

* somente `SIMPLE`, `GUIDE` e `ERROR_SOLUTION` podem ser editadas nesta fase;
* o tipo é exibido somente para leitura e não é recebido como campo editável;
* o slug identifica o alvo, permanece estável e não é recalculado quando o título muda;
* o cancelamento retorna ao detalhe sem chamar a Server Action e sem persistir alterações;
* `SNIPPET` e `COMPARISON` continuam legíveis, mas não exibem a ação de edição;
* erros esperados são devolvidos pela Server Action como resultados controlados;
* `notFound()` e redirects de autenticação continuam seguindo o fluxo nativo do Next.js.

---

## Segurança e ownership

A página exige `requireCurrentUser` antes de carregar a nota e o catálogo. A consulta de edição combina:

* slug recebido pela rota;
* `userId` do usuário autenticado;
* conjunto explícito de tipos editáveis.

A mutation repete a mesma verificação dentro da transação, imediatamente antes de qualquer escrita. O `userId` nunca vem do formulário ou de outro valor controlado pelo cliente.

Nota inexistente, pertencente a outro usuário ou de tipo não editável segue o mesmo caminho de `404`. O alvo também é revalidado no momento do envio, cobrindo o caso em que deixa de existir depois da abertura do formulário.

---

## Slug e tipo

O slug é usado somente como localizador estável. A mutation atualiza a nota pelo `id` encontrado após validar slug, ownership e tipo, e devolve o slug original para a navegação de sucesso.

O tipo não faz parte da entrada de atualização e não é alterado pela mutation. O formulário apresenta apenas o badge correspondente ao tipo atual.

---

## Título, resumo e conteúdo

As validações decisivas são executadas no servidor:

* o título deve ter pelo menos três caracteres depois de `trim`;
* o conteúdo é obrigatório depois de `trim`;
* o resumo é opcional;
* resumo vazio ou composto somente por espaços é persistido como `null`.

O cliente mantém validações de experiência equivalentes, preserva os valores preenchidos quando recebe um resultado controlado de erro e bloqueia submissões duplicadas.

---

## Área, categoria e tags

O formulário reutiliza o catálogo global real de áreas, categorias e tags.

No servidor:

* área e categoria são obrigatórias;
* a área deve existir;
* a categoria deve existir e pertencer à área selecionada;
* tags são opcionais;
* IDs repetidos de tags são deduplicados;
* todas as tags enviadas devem existir no catálogo global.

A seleção enviada substitui integralmente as relações anteriores em `NoteTag`. Enviar nenhuma tag remove todas as associações da nota.

---

## Favorito

O formulário de edição persiste o campo `favorite` junto com os demais dados da nota.

As ações rápidas de favorito existentes no detalhe e nas demais telas continuam somente locais. Sua persistência permanece reservada para a Fase 5D.

---

## Atomicidade e `updatedAt`

A mutation executa na mesma transação Prisma:

1. confirmação do alvo por slug, ownership e tipo permitido;
2. validação da área, categoria e tags;
3. atualização de `Note`;
4. remoção das relações anteriores em `NoteTag`;
5. criação das novas relações, quando existirem.

Uma falha em qualquer escrita reverte a operação inteira. Como `Note.update` participa de todo salvamento, `updatedAt` avança inclusive quando a alteração efetiva é somente no conjunto de tags.

---

## Revalidação

Depois da persistência confirmada, são revalidados:

* `/`;
* `/dashboard`;
* `/anotacoes`;
* o detalhe concreto em `/anotacoes/[id]`;
* `/areas`;
* `/tags`;
* `/favoritos`.

Uma falha posterior de revalidação é registrada separadamente e não transforma uma atualização já persistida em falsa falha de gravação.

---

## Validações executadas

Passaram:

* `npm.cmd run type-check`;
* `npm.cmd run build`;
* `git diff --check`;
* revisão estática do fluxo de edição, ownership e fronteiras entre servidor e cliente;
* testes funcionais críticos pelo fluxo HTTP real das Server Actions e pela aplicação local.

Os testes confirmaram:

* edição normal com persistência real;
* manutenção do mesmo slug;
* tipo imutável;
* erros de validação permanecendo como resultados controlados no formulário;
* área e categoria compatíveis;
* substituição e remoção integral de tags;
* resumo vazio persistido como `null`;
* favorito persistido pelo formulário;
* avanço de `updatedAt`, inclusive em alteração somente de tags;
* bloqueio de `SNIPPET` e `COMPARISON` para edição;
* `404` para alvo inexistente, fora do ownership ou não editável;
* `404` quando o alvo é removido entre a abertura e o envio;
* redirects de autenticação preservados quando não existe sessão;
* cancelamento sem persistência;
* atualização das leituras revalidadas.

Os dados sintéticos usados na regressão foram removidos ao final.

Não houve teste visual automatizado completo, pois a automação visual não iniciou por limitação do plugin. Essa limitação não foi descrita como validação visual aprovada.

---

## Limitações conscientes

Não foram implementados:

* controle otimista de concorrência;
* histórico ou versionamento de alterações;
* gerenciamento do catálogo global;
* persistência das ações rápidas de favorito;
* edição estruturada de `SNIPPET` ou `COMPARISON`.

O risco conhecido em `prisma/seed.ts`, que pode substituir o `passwordHash` da conta inicial por `null`, permanece pendente. O seed não foi corrigido nem executado nesta fase.

---

## Fora do escopo

Permanecem fora da Fase 5B:

* exclusão real e fechamento do CRUD básico — Fase 5C;
* ações rápidas persistentes de favorito — Fase 5D;
* CRUD estruturado de `SNIPPET` — Fase 5E, condicionado à aprovação específica de suas regras funcionais;
* CRUD estruturado de `COMPARISON` — Fase 5F, condicionado à aprovação específica de suas regras funcionais;
* refinamento de busca e filtros — Fase 5G;
* estados e fechamento visual amplo — Fase 5H;
* produção, banco de produção e deploy.

---

## Alterações estruturais não realizadas

A Fase 5B não exigiu:

* alteração do schema Prisma;
* migration;
* alteração ou execução do seed;
* nova dependência;
* nova variável de ambiente;
* API pública.

---

## Commit de implementação

```txt
6f9496c feat: implementa edicao real de anotacoes
```

---

## Estado final

A Fase 5B está concluída. A próxima subfase é a Fase 5C — Exclusão real e fechamento do CRUD básico, que deve ser diagnosticada e planejada separadamente antes de qualquer implementação.
