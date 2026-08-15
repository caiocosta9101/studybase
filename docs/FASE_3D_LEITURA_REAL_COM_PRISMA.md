# Fase 3D — Leitura real do banco com Prisma

Status: concluída.

## Objetivo

Iniciar a substituição gradual dos dados mockados por dados reais do PostgreSQL usando Prisma.

A primeira integração real foi pequena, segura e em modo somente leitura. A fase evoluiu gradualmente até cobrir as telas de leitura relevantes.

---

## Contexto

A Fase 3C foi concluída.

Já temos:

* roadmap atualizado;
* status do projeto atualizado;
* diagnóstico dos mocks documentado;
* PostgreSQL local funcionando;
* migration aplicada;
* seed executado;
* dados fake validados no Prisma Studio;
* build aprovado.

O diagnóstico da Fase 3C indicou que a primeira tela mais segura para integração real é:

```txt
/anotacoes
```

---

## Escopo permitido

Nesta fase foi permitido:

* criar uma camada simples server-side para leitura com Prisma;
* buscar notas reais do banco;
* incluir relações necessárias, como área, categoria, tags, snippet e comparação;
* mapear os dados do Prisma para o formato que a interface atual espera;
* testar primeiro a listagem de `/anotacoes` e ampliar as leituras em etapas aprovadas;
* manter mocks funcionando nas demais telas, se necessário;
* validar build após a alteração.

---

## Fora do escopo

Ficaram fora do escopo da Fase 3D:

* implementar criação real de notas;
* implementar edição real;
* implementar exclusão real;
* implementar favoritos reais com escrita no banco;
* implementar autenticação;
* implementar IA;
* criar API pública sem aprovação;
* trocar todos os mocks de uma vez;
* fazer grande refatoração no contexto global;
* alterar o schema sem necessidade clara;
* alterar o seed sem validação prévia.

Também permaneceram fora do escopo a persistência real de favoritos e a criação real em `/anotacoes/nova`. Esses comportamentos continuam apenas locais e simulados.

---

## Primeira entrega realizada

A primeira entrega da Fase 3D foi:

```txt
Listagem real de notas em /anotacoes
```

Essa entrega:

* buscar notas reais do PostgreSQL;
* exibir título, resumo, tipo, área, categoria, tags e favorito;
* preservar o máximo possível da interface atual;
* evitar escrita no banco;
* evitar autenticação;
* evitar API pública.

---

## Estratégia técnica inicial

A estratégia preferida é começar com uma função server-side simples em `src/lib/`.

Exemplo de direção arquitetural:

```txt
src/lib/
  prisma.ts
  notes/
    queries.ts
```

A função de leitura deve ficar isolada para evitar espalhar Prisma diretamente pelas páginas.

Atenção:

* Prisma deve rodar no servidor.
* Não importar Prisma em Client Components.
* Se alguma tela atual for Client Component, avaliar uma adaptação mínima antes de implementar.
* Manter a solução simples e legível.

---

## Decisões técnicas consolidadas

Durante a execução da fase, foram consolidadas as seguintes decisões:

1. Prisma permanece somente em código server-side.
2. As consultas de leitura ficam centralizadas em `src/lib/notes/queries.ts`.
3. O mapeamento Prisma → UI fica em funções próprias quando necessário.
4. A rota de detalhes usa o `slug` da nota.
5. `NotesProvider` e mocks foram preservados apenas para o fluxo local de criação simulada.
6. Favoritos nas telas integradas continuam apenas visuais e locais, sem escrita no banco.

---

## Campos derivados da interface

Alguns campos usados pela interface não vêm diretamente do banco e podem precisar ser calculados:

* `typeLabel`;
* `readingTime`;
* `updatedAt` formatado;
* `highlights`;
* labels visuais de área/categoria/tags.

Esses campos não devem exigir alteração imediata no schema.

---

## Riscos conhecidos

* Prisma não pode ser usado em componentes client-side.
* A interface foi criada inicialmente em cima de mocks, por isso os dados reais precisam continuar sendo mapeados para o formato da UI.
* Favoritos e criação continuam simulados onde não há escrita aprovada.
* A criação simulada em `/anotacoes/nova` não substitui o CRUD real futuro.

---

## Execução concluída

### Etapa 1 — Diagnóstico e arquitetura

Foi definido o fluxo Prisma → `queries.ts` → mapper, quando necessário → Server Component → Client Component → UI.

### Etapa 2 — Leituras reais integradas

Foram integradas com leitura real as rotas:

* `/`;
* `/dashboard`;
* `/anotacoes`;
* `/anotacoes/[id]`;
* `/favoritos`;
* `/areas`;
* `/tags`.

### Etapa 3 — Interações locais preservadas

Busca e filtros permanecem locais nas telas integradas. Favoritos continuam visuais e locais, sem persistência. A rota `/anotacoes/nova` continua com criação simulada e local.

### Etapa 4 — Validação

Builds e testes visuais das rotas integradas foram validados ao longo da fase.

---

## Checklist de validação

* [x] Telas de leitura analisadas e integradas gradualmente.
* [x] Estratégia técnica aprovada antes de cada entrega.
* [x] Prisma isolado em camada server-side.
* [x] Nenhum Prisma importado em Client Component.
* [x] Leituras reais funcionando em `/`, `/dashboard`, `/anotacoes`, `/anotacoes/[id]`, `/favoritos`, `/areas` e `/tags`.
* [x] Mocks preservados apenas onde ainda são necessários para a criação simulada.
* [x] Nenhum CRUD real implementado.
* [x] Nenhuma escrita no banco pela aplicação foi implementada.
* [x] Nenhuma autenticação implementada.
* [x] Nenhuma IA implementada.
* [x] Builds e testes visuais validados.
* [x] Alterações revisadas antes dos commits.

---

## Resultado alcançado da Fase 3D

O StudyBase passou a usar leitura real do PostgreSQL com Prisma em todas as telas de leitura relevantes: `/`, `/dashboard`, `/anotacoes`, `/anotacoes/[id]`, `/favoritos`, `/areas` e `/tags`.

Prisma permaneceu exclusivamente no servidor, e as consultas de leitura foram centralizadas em `src/lib/notes/queries.ts`. Não houve escrita no banco pela aplicação durante a fase. CRUD real, persistência de favoritos, autenticação, IA e API pública ficaram fora do escopo da Fase 3D.

## Situação posterior

Depois da conclusão da Fase 3D, as Fases 4A, 4B, 4C e 4D implementaram e publicaram a autenticação real. A substituição dos fluxos locais restantes começou posteriormente na Fase 5.
