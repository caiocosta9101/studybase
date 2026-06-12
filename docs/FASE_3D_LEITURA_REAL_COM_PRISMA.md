# Fase 3D — Leitura real do banco com Prisma

## Objetivo

Iniciar a substituição gradual dos dados mockados por dados reais do PostgreSQL usando Prisma.

A primeira integração real deve ser pequena, segura e em modo somente leitura.

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

Nesta fase podemos:

* criar uma camada simples server-side para leitura com Prisma;
* buscar notas reais do banco;
* incluir relações necessárias, como área, categoria, tags, snippet e comparação;
* mapear os dados do Prisma para o formato que a interface atual espera;
* testar primeiro a listagem de `/anotacoes`;
* manter mocks funcionando nas demais telas, se necessário;
* validar build após a alteração.

---

## Fora do escopo

Nesta fase não devemos:

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

---

## Primeira entrega recomendada

A primeira entrega da Fase 3D deve ser:

```txt
Listagem real de notas em /anotacoes
```

Essa entrega deve:

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

## Pontos técnicos a decidir antes de implementar

Antes de alterar código da aplicação, decidir:

1. A página `/anotacoes` hoje é Server Component ou Client Component?
2. O `NotesProvider` será mantido para as telas mockadas?
3. A listagem real usará uma função server-side separada?
4. O mapeamento Prisma → UI será feito em uma função própria?
5. A rota de detalhes futura usará `slug` ou `id`?
6. Quais campos derivados serão calculados na aplicação?
7. Como lidar temporariamente com favoritos simulados?

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
* A interface atual foi criada em cima de mocks.
* A rota `/anotacoes/[id]` ainda depende dos mocks.
* Favoritos e criação ainda são simulados.
* Alguns campos dos mocks não batem diretamente com o schema.
* Trocar tudo de uma vez pode quebrar várias telas.

---

## Plano sugerido

### Etapa 1 — Diagnóstico técnico da tela `/anotacoes`

Verificar como a tela está estruturada hoje e quais componentes ela usa.

### Etapa 2 — Proposta de implementação

Definir a menor alteração possível para carregar notas reais apenas na listagem.

### Etapa 3 — Aprovação

Revisar a proposta antes de alterar código.

### Etapa 4 — Implementação mínima

Criar leitura real com Prisma apenas para `/anotacoes`.

### Etapa 5 — Validação

Rodar:

```bash
npm run build
```

E validar visualmente a tela `/anotacoes`.

---

## Checklist de validação

* [ ] Tela `/anotacoes` analisada.
* [ ] Estratégia técnica aprovada.
* [ ] Prisma isolado em camada server-side.
* [ ] Nenhum Prisma importado em Client Component.
* [ ] Listagem real funcionando.
* [ ] Mocks preservados onde ainda forem necessários.
* [ ] Nenhum CRUD real implementado.
* [ ] Nenhuma autenticação implementada.
* [ ] Nenhuma IA implementada.
* [ ] Build passando.
* [ ] Alterações revisadas antes do commit.

---

## Resultado esperado da Fase 3D

Ao final da Fase 3D, o StudyBase deve ter a primeira leitura real do banco funcionando com Prisma, começando pela listagem de anotações.

O restante do sistema pode continuar usando mocks até as próximas fases.
