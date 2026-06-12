# Fase 3B — PostgreSQL local, migration e seed

## Status

Planejada.

## Objetivo

Configurar o banco PostgreSQL local, gerar a primeira migration do Prisma e criar um seed inicial simples para testar os dados persistidos no banco.

Esta fase serve para transformar o schema criado na Fase 3A em tabelas reais no PostgreSQL local, sem ainda implementar API real, CRUD real ou autenticação.

---

## Contexto anterior

A Fase 3A configurou o Prisma no projeto e criou o schema inicial para PostgreSQL.

O schema atual possui os seguintes models:

* User
* Area
* Category
* Note
* Tag
* NoteTag
* Comparison
* ComparisonOption
* Snippet

O model `Comparison` suporta múltiplas opções usando o model `ComparisonOption`.

Até o momento, o projeto ainda trabalha com dados mockados no front-end.

---

## Decisão da fase

Nesta fase, o projeto usará apenas PostgreSQL local.

Não será usado Supabase, Neon, Railway ou qualquer banco em nuvem por enquanto.

A decisão é manter a fase pequena, segura e validável antes de conectar a aplicação ao banco de verdade.

---

## Escopo da Fase 3B

Esta fase deve incluir:

* Revisar o `schema.prisma` antes da primeira migration
* Configurar o banco PostgreSQL local
* Criar o banco local `studybase_dev`
* Configurar o arquivo `.env` local com `DATABASE_URL`
* Validar o arquivo `.env.example`
* Garantir que `.env` e `.env.local` não sejam versionados
* Gerar a primeira migration do Prisma
* Gerar o Prisma Client
* Criar um seed inicial simples
* Rodar o seed no banco local
* Validar os dados no Prisma Studio
* Rodar o build final do projeto

---

## Fora do escopo

Esta fase não deve incluir:

* API real
* CRUD real
* autenticação real
* IA
* Supabase
* banco em produção
* deploy
* upload de arquivos
* permissões avançadas
* grandes refatorações
* grandes mudanças visuais
* alteração grande de arquitetura

---

## Banco local

Nome sugerido para o banco local:

```txt
studybase_dev
```

Exemplo de variável no arquivo `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/studybase_dev?schema=public"
```

O arquivo `.env` deve existir apenas localmente.

O arquivo `.env.example` pode ser versionado, mas nunca deve conter usuário, senha ou credenciais reais.

Exemplo seguro para `.env.example`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/studybase_dev?schema=public"
```

---

## Segurança

Antes de qualquer migration, confirmar se o `.gitignore` possui:

```txt
.env
.env.local
```

Credenciais reais não devem ser enviadas para o GitHub.

Nenhum banco remoto deve ser configurado nesta fase.

---

## Revisão antes da migration

Antes de rodar a primeira migration, revisar com cuidado:

* nomes dos models
* campos obrigatórios e opcionais
* relações entre tabelas
* regras de `onDelete`
* campos `createdAt`
* campos `updatedAt`
* enum `NoteType`
* relação entre `Note` e `Tag`
* relação entre `Comparison` e `ComparisonOption`
* relação entre `Note` e `Snippet`
* relação entre `Area`, `Category` e `Note`

Nenhuma alteração no schema deve ser feita sem explicação prévia.

---

## Comandos previstos

Criar a primeira migration:

```bash
npx prisma migrate dev --name init
```

Gerar o Prisma Client:

```bash
npx prisma generate
```

Rodar o seed:

```bash
npx prisma db seed
```

Abrir o Prisma Studio:

```bash
npx prisma studio
```

Validar o projeto:

```bash
npm run build
```

---

## Seed inicial

O seed deve ser pequeno e servir apenas para testar as relações principais do banco.

Sugestão de dados:

* 1 usuário fake
* 3 áreas
* categorias relacionadas às áreas
* notas de tipos diferentes
* algumas tags
* relação entre notas e tags
* 1 comparação com múltiplas opções
* 1 snippet

Exemplo de áreas:

* Programação
* Inglês
* Saúde

Exemplo de categorias:

* Next.js
* Banco de Dados
* Verb to be
* Vocabulary
* Treino
* Nutrição

Exemplo de notas:

* O que é Prisma?
* O que é migration?
* Regras do verbo to be
* Organização de treino semanal

Exemplo de comparação:

* Prisma vs SQL puro

Exemplo de opções da comparação:

* Prisma
* SQL puro
* Query Builder

Exemplo de snippet:

* Exemplo básico de comando Prisma

---

## Arquivos que podem ser criados ou alterados

Arquivos que provavelmente serão alterados:

```txt
.env.example
.gitignore
package.json
prisma/schema.prisma
```

Arquivos que provavelmente serão criados:

```txt
.env
prisma/seed.ts
prisma/migrations/
```

Observação: o arquivo `.env` será local e não deve ser versionado.

---

## Critérios de conclusão

A Fase 3B será considerada concluída quando:

* O PostgreSQL local estiver funcionando
* O banco `studybase_dev` existir
* O `.env` estiver configurado localmente
* O `.env.example` estiver seguro
* O `.gitignore` proteger `.env` e `.env.local`
* O schema tiver sido revisado antes da migration
* A primeira migration tiver sido criada
* O Prisma Client tiver sido gerado
* O seed rodar sem erro
* Os dados aparecerem no Prisma Studio
* O comando `npm run build` rodar sem erro
* Nenhuma credencial real tiver sido versionada

---

## Próxima fase prevista

Após concluir a Fase 3B, a próxima fase natural será a Fase 3C.

Sugestão:

Fase 3C — Primeira leitura real do banco.

Objetivo provável:

* Criar uma camada segura para buscar dados reais do banco
* Substituir gradualmente parte dos dados mockados por dados vindos do PostgreSQL local
* Começar apenas com leitura
* Ainda não implementar CRUD completo
* Ainda não implementar autenticação real
