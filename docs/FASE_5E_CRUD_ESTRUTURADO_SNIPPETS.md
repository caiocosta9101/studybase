# Fase 5E — CRUD estruturado de snippets

Status: concluída.

## Objetivo

Implementar o CRUD persistente de anotações do tipo `SNIPPET`, preservando seus dados estruturados, o ownership da sessão e os fluxos já consolidados para tipos básicos, favoritos e comparações.

---

## Regra funcional central

Uma nota `SNIPPET` criada e editável possui funcionalmente exatamente um registro `Snippet` válido.

Para ser válido, o bloco estruturado precisa ter:

* linguagem preenchida e diferente de somente espaços;
* código preenchido e diferente de somente espaços;
* explicação opcional.

A linguagem é persistida sem espaços externos. O código usa `trim()` somente para validar presença e é armazenado com seu conteúdo original, preservando indentação e quebras de linha. Uma explicação vazia ou formada somente por espaços é tratada como ausência.

`Note.summary` continua opcional. `Note.content` também é opcional para `SNIPPET` e pode registrar contexto geral sem duplicar a explicação específica do código.

---

## Leitura e detalhe

O detalhe de uma nota `SNIPPET` válida apresenta:

* os dados gerais da nota;
* a linguagem;
* o código completo em bloco apropriado;
* a explicação, quando existente;
* o conteúdo geral, quando existente.

A leitura deixou de selecionar silenciosamente `snippets[0]`. O estado estruturado passou a ser representado de forma discriminada e reconhece:

* exatamente um snippet válido;
* ausência de snippet;
* múltiplos snippets;
* linguagem ou código inválidos;
* presença incompatível de `Comparison`.

Estados inconsistentes recebem uma mensagem controlada e não provocam escolha arbitrária, reparo automático ou descarte de dados.

---

## Criação

O tipo `SNIPPET` foi disponibilizado em `/anotacoes/nova` junto com `SIMPLE`, `GUIDE` e `ERROR_SOLUTION`. `COMPARISON` continua indisponível nesse fluxo.

O formulário adiciona linguagem, código e explicação somente quando o tipo selecionado é `SNIPPET`. Linguagem e código são obrigatórios; resumo, conteúdo geral e explicação permanecem opcionais.

A Server Action:

* faz parsing seguro dos valores de `FormData`;
* usa uma whitelist explícita dos quatro tipos autorizados;
* obtém o usuário exclusivamente da sessão;
* não aceita `userId` do cliente;
* separa explicitamente a criação básica da criação de snippet.

A mutation específica fixa o tipo persistido como `SNIPPET` e cria, na mesma transação Prisma:

* a `Note`;
* exatamente um `Snippet` aninhado;
* as associações `NoteTag`, quando selecionadas.

A validação de área, categoria e tags também usa o client da transação. Uma falha em qualquer etapa impede a criação parcial da nota.

---

## Edição

A edição é disponibilizada somente quando a nota `SNIPPET` possui exatamente um filho válido e não possui `Comparison`.

O formulário permite atualizar:

* título;
* resumo;
* conteúdo geral;
* área;
* categoria;
* tags;
* favorito;
* linguagem;
* código;
* explicação.

Slug e tipo permanecem imutáveis. O tipo enviado pelo formulário serve apenas para selecionar o ramo da Server Action; a mutation confirma o tipo persistido no banco.

Dentro da mesma transação, a mutation revalida:

* slug;
* `userId` da sessão;
* `type = SNIPPET`;
* ausência de `Comparison`;
* cardinalidade de exatamente um filho;
* validade atual de linguagem e código;
* catálogo de área, categoria e tags.

O ID do filho é obtido no servidor a partir da nota já autorizada. O registro `Snippet` existente é atualizado sem substituição, preservando `Snippet.id` e `Snippet.createdAt`. A nota, o filho e a substituição de tags participam da mesma transação.

---

## Exclusão

Uma nota própria `SNIPPET` pode ser excluída quando não possui `Comparison` associada.

Para exclusão da nota inteira, a quantidade e a validade dos registros `Snippet` não são usadas como bloqueio. Portanto, são elegíveis notas `SNIPPET` com:

* zero snippets;
* exatamente um snippet;
* vários snippets;
* snippet com campos inválidos.

A operação decisiva de `Note` combina:

* slug;
* `userId` da sessão;
* ramo explícito para os três tipos básicos;
* ramo explícito para `SNIPPET`;
* condições de elegibilidade das relações.

Não existe ramo para `COMPARISON`. Uma nota `SNIPPET` com `Comparison` também permanece inelegível.

`Snippet` e `NoteTag` são removidos pelos cascades já existentes no PostgreSQL. Não há limpeza manual dos filhos nem transação adicional. `Area`, `Category`, `Tag` e `User` são preservados.

---

## Estados inconsistentes

### `SNIPPET` sem filho

* leitura controlada;
* edição bloqueada;
* exclusão permitida quando não existe `Comparison`.

### `SNIPPET` com múltiplos filhos

* leitura controlada;
* nenhum filho é selecionado silenciosamente;
* edição bloqueada;
* exclusão permitida quando não existe `Comparison`.

### `SNIPPET` com campos estruturados inválidos

* leitura controlada;
* edição bloqueada;
* exclusão permitida quando não existe `Comparison`.

### `SNIPPET` com `Comparison`

* estado classificado como incompatível;
* edição bloqueada;
* exclusão bloqueada pela Fase 5E.

Nenhum desses estados recebe reparo automático, seleção arbitrária de filho ou remoção silenciosa de dados.

---

## Segurança e ownership

As escritas da fase mantêm as seguintes invariantes:

* o usuário é resolvido exclusivamente pela sessão;
* nenhum `userId` é aceito do cliente;
* o ownership de `Snippet` deriva da `Note`;
* um `Snippet.id` fornecido pelo cliente não autoriza escrita;
* criação usa a própria nota criada pelo servidor como pai;
* edição confirma pai, ownership, tipo, cardinalidade e ausência de `Comparison` dentro da transação;
* o ID atualizado na edição é obtido pelo servidor;
* exclusão inclui ownership e elegibilidade na própria operação decisiva;
* nota inexistente, externa ou inelegível permanece externamente indistinguível;
* ausência de botão na interface não substitui autorização server-side.

Nenhuma mutation da Fase 5E cria, atualiza ou exclui `Comparison` ou `ComparisonOption`.

---

## Atomicidade e catálogo

Na criação, validação de catálogo, `Note`, `Snippet` e `NoteTag` participam da mesma transação.

Na edição, ownership, tipo, cardinalidade, compatibilidade estrutural, catálogo, `Note`, `Snippet` e substituição de `NoteTag` são tratados na mesma transação.

A exclusão permanece uma única operação condicional de `Note`, usando os cascades existentes para os filhos. Não foi adicionada transação sem necessidade.

---

## Comportamento de `updatedAt`

Toda edição completa bem-sucedida avança `Note.updatedAt`, inclusive quando a alteração relevante está somente nos dados do snippet ou nas tags.

`Snippet.updatedAt` avança quando linguagem, código ou explicação realmente mudam. Quando nenhum campo do filho mudou, sua atualização desnecessária é evitada.

O favorito salvo pelo formulário completo faz parte da edição normal e pode avançar `Note.updatedAt`.

A ação rápida de favorito da Fase 5D permanece separada dos dados estruturados, atende os cinco tipos e continua preservando `Note.updatedAt`.

---

## Preservação dos fluxos existentes

Os tipos `SIMPLE`, `GUIDE` e `ERROR_SOLUTION` mantêm:

* criação, leitura, edição e exclusão persistentes;
* conteúdo obrigatório;
* área, categoria e tags;
* favorito;
* slug estável e ownership;
* proteção contra exclusão quando existem relações estruturadas incompatíveis.

Esses tipos não criam nem atualizam registros `Snippet`.

A leitura de `COMPARISON` permanece funcionando, mas sua criação, edição e exclusão continuam indisponíveis. As whitelists não foram ampliadas indiscriminadamente e nenhuma abstração genérica antecipou a Fase 5F.

Listagens, home, dashboard e favoritos continuam usando dados gerais da nota, sem carregar snippets para os cards. O filtro por tipo `SNIPPET` permanece disponível, mas linguagem, código e explicação não foram incluídos na busca.

---

## Schema e decisão de cardinalidade

A Fase 5E não alterou `prisma/schema.prisma` e não exigiu migration.

O banco continua permitindo estruturalmente a relação 0:N entre `Note` e `Snippet`. A regra de exatamente um snippet válido é uma invariável consciente da aplicação para criação e edição, não uma constraint adicionada nesta fase.

Essa decisão mantém compatibilidade com dados antigos ou criados manualmente. Estados inconsistentes são tratados defensivamente pela leitura, edição e exclusão, sem considerar a ausência de constraint um defeito pendente da Fase 5E.

O seed permaneceu intacto e não foi executado durante a fase.

---

## Validações executadas

Passaram as verificações automáticas:

* `npm.cmd run type-check`;
* `npm.cmd run build`;
* `git diff --check`;
* `git diff --cached --check` antes do commit funcional.

O usuário concluiu e aprovou a validação manual autenticada dos seguintes cenários:

1. criação de `SNIPPET`;
2. detalhe e persistência depois de reload;
3. edição estruturada;
4. favorito rápido;
5. exclusão;
6. regressão de tipo básico;
7. permanência de `COMPARISON` sem CRUD.

Não foram criados usuários artificiais, executado o seed ou produzidos estados inconsistentes apenas para ampliar os testes.

---

## Arquivos funcionais da fase

Alterados:

* `src/app/anotacoes/[id]/actions.ts`;
* `src/app/anotacoes/[id]/editar/actions.ts`;
* `src/app/anotacoes/nova/actions.ts`;
* `src/components/anotacoes/edit-note-form.tsx`;
* `src/components/anotacoes/new-note-form.tsx`;
* `src/components/note-details-view.tsx`;
* `src/lib/notes/mappers.ts`;
* `src/lib/notes/mutations.ts`;
* `src/lib/notes/queries.ts`;
* `src/types/note.ts`.

---

## Commit de implementação

```txt
1aba01f feat: implementa crud estruturado de snippets
```

Hash completo:

```txt
1aba01f889e9816fbb9e58f9c453543d9069fef3
```

---

## Fora do escopo preservado

A Fase 5E não incluiu:

* CRUD de `COMPARISON` — Fase 5F;
* busca por linguagem, código ou explicação — Fase 5G;
* refinamentos gerais de estados e interface — Fase 5H;
* múltiplos snippets como funcionalidade suportada;
* ordenação de snippets;
* syntax highlighting avançado;
* botão de copiar;
* execução de código;
* catálogo, enum ou autocomplete de linguagens;
* alteração de schema;
* migration;
* alteração ou execução do seed;
* deploy ou preparação de produção.

---

## Resultado e estado final

A Fase 5E está concluída. O CRUD estruturado de `SNIPPET` foi implementado, auditado, validado automaticamente e aprovado em validação manual autenticada.

A próxima subfase planejada é a Fase 5F — CRUD estruturado de `COMPARISON`. Ela permanece não iniciada e depende da revisão e aprovação específica de suas regras funcionais antes do planejamento ou da implementação.
