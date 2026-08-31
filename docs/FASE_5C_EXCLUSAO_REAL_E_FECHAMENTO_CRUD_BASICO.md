# Fase 5C — Exclusão real e fechamento do CRUD básico

Status: concluída.

## Objetivo

Fechar o CRUD persistente básico dos tipos:

* `SIMPLE`;
* `GUIDE`;
* `ERROR_SOLUTION`.

Esta subfase adiciona exclusão real, permanente e segura às operações de criação da Fase 5A, leitura já existente e edição da Fase 5B.

---

## Escopo implementado

Foram implementados:

* exclusão permanente de notas básicas próprias;
* ação de exclusão somente na página de detalhe;
* confirmação inline antes da operação destrutiva;
* `userId` obtido exclusivamente da sessão autenticada;
* slug usado somente como localizador do alvo;
* validação do tipo persistido no servidor;
* `prisma.note.deleteMany` como operação decisiva;
* ownership incluído no próprio `where` da exclusão;
* whitelist explícita de `SIMPLE`, `GUIDE` e `ERROR_SOLUTION`;
* bloqueio de `SNIPPET` e `COMPARISON`;
* bloqueio de nota básica que possua qualquer `Snippet` ou `Comparison` associado;
* tratamento uniforme de `count === 0` com `404`;
* remoção de `NoteTag` pelo cascade existente;
* preservação de área, categoria, tags globais e usuário;
* prevenção imediata e visual de submissão duplicada;
* navegação de sucesso com `router.replace`;
* banner cosmético de sucesso na listagem;
* `revalidatePath("/anotacoes")` como única revalidação explícita;
* comportamento de ausência e `404` no detalhe e na edição depois da exclusão.

A exclusão normal não usa transação Prisma, pois a operação condicional única e os cascades existentes cobrem o escopo aprovado.

---

## Arquivos principais

Criado:

* `src/app/anotacoes/[id]/actions.ts`.

Alterados:

* `src/app/anotacoes/page.tsx`;
* `src/components/note-details-view.tsx`;
* `src/lib/notes/mutations.ts`.

---

## Segurança e ownership

O cliente envia somente o slug usado para localizar a nota. O `userId` é obtido por `requireCurrentUser()` e nunca é recebido do cliente.

O tipo autorizado também não é controlado pelo cliente. O `deleteMany` verifica simultaneamente:

* slug da nota;
* `userId` da sessão;
* tipo persistido dentro da whitelist aprovada;
* ausência de `Comparison`;
* ausência de qualquer `Snippet`.

Autorização e exclusão participam da mesma operação decisiva. Não existe uma leitura de autorização seguida por uma exclusão genérica somente por slug ou id.

A ausência do botão na interface não é usada como mecanismo de segurança. Uma chamada manual contra nota inexistente, pertencente a outro usuário, de tipo estruturado ou com dados estruturados incompatíveis resulta no mesmo `count === 0` e segue o fluxo uniforme de `404`, sem revelar ownership ou a causa específica do bloqueio.

`SNIPPET` e `COMPARISON` permanecem fora da Fase 5C. Notas básicas com relações estruturadas inconsistentes também são preservadas, pois não são elegíveis para a exclusão.

---

## Cascade e registros preservados

O código não remove manualmente `NoteTag`, `Snippet`, `Comparison` ou `ComparisonOption`.

Para uma nota básica elegível, as relações `NoteTag` são removidas pelo cascade já definido no schema. Área, categoria, tags globais e usuário não são alvos da exclusão e permanecem preservados.

Os filtros de ausência de dados estruturados impedem que a Fase 5C acione cascades sobre `Snippet`, `Comparison` ou `ComparisonOption` associados a uma nota básica inconsistente.

---

## Experiência de uso

O botão `Excluir` aparece somente no detalhe de `SIMPLE`, `GUIDE` e `ERROR_SOLUTION`.

O fluxo apresenta:

1. botão inicial `Excluir`;
2. confirmação inline com aviso de que a operação é permanente;
3. opção `Cancelar`;
4. opção `Excluir permanentemente`;
5. estado `Excluindo…` durante a submissão.

Um `useRef` bloqueia imediatamente uma segunda submissão e o estado visual desabilita os controles durante a operação. Se a Server Action rejeitar, o estado local é liberado e a exceção original é relançada, preservando o fluxo nativo do Next.js para exceções de controle como `notFound()`.

Depois do sucesso, `router.replace("/anotacoes?status=note_deleted")` substitui o detalhe no histórico. O parâmetro `status=note_deleted` exibe somente um feedback visual removível e não participa de autorização, persistência ou qualquer decisão de segurança.

---

## Revalidação e leituras

A única revalidação explícita adicionada foi:

```ts
revalidatePath("/anotacoes");
```

As páginas afetadas usam leituras dinâmicas e não possuem cache adicional de consultas Prisma identificado. Os testes confirmaram atualização funcional de home, dashboard, listagem, áreas, tags e favoritos sem ampliar a estratégia de revalidação.

Depois da exclusão, o detalhe antigo e sua rota de edição retornam `404`. Recarregar a aplicação ou navegar pelo histórico não reapresenta a nota como válida.

---

## Validações executadas

Passaram:

* exclusão real de nota própria `SIMPLE`;
* exclusão real de nota própria `GUIDE`;
* exclusão real de nota própria `ERROR_SOLUTION`;
* persistência da exclusão depois de reload;
* `404` no detalhe removido;
* `404` na edição da nota removida;
* proteção contra exclusão de nota de outro usuário;
* proteção de `SNIPPET`;
* proteção de `COMPARISON`;
* bloqueio de nota básica com `Snippet` ou `Comparison` associado;
* remoção de `NoteTag` por cascade;
* preservação de área, categoria, tags globais e usuário;
* bloqueio de submissão duplicada;
* navegação de sucesso e comportamento do histórico;
* atualização das leituras afetadas;
* regressão de criação, leitura e edição dos três tipos básicos;
* regressão de leitura de `SNIPPET` e `COMPARISON`;
* `npm.cmd run type-check`;
* `npm.cmd run build`;
* `git diff --check`;
* testes manuais no navegador.

Os testes manuais confirmaram cancelamento sem exclusão, exclusão real, redirecionamento de sucesso, persistência após reload, ausência nas rotas antigas, manutenção da edição básica e permanência do favorito rápido como interação local.

---

## Limitações conscientes

Permanecem fora desta subfase:

* persistência das ações rápidas de favorito — Fase 5D;
* CRUD estruturado de `SNIPPET` — Fase 5E, condicionado à aprovação específica de suas regras funcionais;
* CRUD estruturado de `COMPARISON` — Fase 5F, condicionado à aprovação específica de suas regras funcionais;
* refinamento de busca e filtros — Fase 5G;
* estados e fechamento visual amplo — Fase 5H;
* produção, banco de produção e deploy.

---

## Alterações estruturais não realizadas

A Fase 5C não exigiu:

* alteração do schema Prisma;
* migration;
* alteração ou execução do seed;
* nova dependência;
* nova variável de ambiente;
* API pública.

O risco conhecido em `prisma/seed.ts`, que pode substituir o `passwordHash` da conta inicial por `null`, permanece como pendência separada. O seed não foi corrigido nem executado na Fase 5C.

---

## Commit de implementação

```txt
d9acb90 feat: implementa exclusao real de anotacoes
```

---

## Resultado e estado final

A Fase 5C está concluída. O CRUD persistente básico de `SIMPLE`, `GUIDE` e `ERROR_SOLUTION` está fechado:

* criação — Fase 5A;
* leitura — fluxo real já existente;
* edição — Fase 5B;
* exclusão — Fase 5C.

A próxima subfase é a Fase 5D — Favoritos persistentes.
