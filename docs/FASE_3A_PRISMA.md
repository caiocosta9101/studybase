Leia o arquivo AGENTS.md antes de fazer qualquer alteração.

Contexto rápido:
As Fases 1, 1.1, 2 e 2.1 do StudyBase já foram concluídas, testadas manualmente, commitadas e enviadas para o GitHub.

O projeto atualmente possui:

* interface visual pronta;
* dados mockados;
* busca e filtros funcionando com estado local;
* favoritos funcionando localmente;
* criação simulada de anotação;
* validações básicas no formulário;
* mensagens de erro e feedbacks de UX.

Agora quero iniciar apenas a Fase 3A: modelagem do banco de dados com Prisma e PostgreSQL.

Objetivo:
Preparar a estrutura de banco do StudyBase sem trocar ainda todo o front mockado pelo banco real.

O StudyBase é uma base pessoal de conhecimento para qualquer assunto. Ele deve permitir organizar anotações por área, categoria, tags, tipo de anotação, favoritos, busca e conteúdos estruturados.

Importante:
Não implemente autenticação real ainda.
Não implemente login real ainda.
Não implemente IA.
Não refaça o design.
Não remova as funcionalidades mockadas atuais.
Não avance para CRUD real completo ainda.
Não quebre as telas existentes.
Não substitua os dados mockados pelo banco nesta fase.
Não rode migration se não houver DATABASE_URL real configurada.

Nesta fase, faça apenas:

1. Instalar e configurar o Prisma.
2. Configurar o Prisma para usar PostgreSQL.
3. Criar a pasta prisma/ se ainda não existir.
4. Criar o arquivo prisma/schema.prisma.
5. Criar um .env.example com a variável DATABASE_URL, sem credenciais reais.
6. Garantir que .env esteja no .gitignore.
7. Criar a modelagem inicial do banco.
8. Rodar npm run build ao final.
9. Explicar a modelagem em linguagem simples.

Models que devem ser criados:

* User
* Area
* Category
* Note
* Tag
* NoteTag
* Comparison
* ComparisonOption
* Snippet

Enum que deve ser criado:

NoteType:

* SIMPLE
* GUIDE
* COMPARISON
* SNIPPET
* ERROR_SOLUTION

Regras de modelagem:

User:

* id
* name
* email único
* passwordHash opcional por enquanto
* createdAt
* updatedAt

Relacionamentos:

* um User pode ter várias Notes
* userId em Note deve ser opcional por enquanto, porque a autenticação ainda não será implementada

Area:

* id
* name
* slug único
* description opcional
* createdAt
* updatedAt

Relacionamentos:

* uma Area pode ter várias Categories
* uma Area pode ter várias Notes

Category:

* id
* name
* slug
* areaId
* createdAt
* updatedAt

Relacionamentos:

* uma Category pertence a uma Area
* uma Category pode ter várias Notes

Regras:

* slug deve ser único dentro da mesma Area, se possível usando chave única composta entre areaId e slug

Note:

* id
* title
* slug
* summary opcional
* content opcional
* type
* favorite boolean com default false
* areaId
* categoryId
* userId opcional
* createdAt
* updatedAt

Relacionamentos:

* uma Note pertence a uma Area
* uma Note pertence a uma Category
* uma Note pode pertencer a um User, mas userId deve ser opcional por enquanto
* uma Note pode ter várias Tags através de NoteTag
* uma Note pode ter uma Comparison, quando type for COMPARISON
* uma Note pode ter vários Snippets, quando fizer sentido

Regras:

* type deve usar o enum NoteType
* slug deve existir para facilitar rotas futuras
* não precisa criar validações condicionais por tipo agora

Tag:

* id
* name
* slug único
* createdAt
* updatedAt

Relacionamentos:

* uma Tag pode estar em várias Notes através de NoteTag

NoteTag:

* noteId
* tagId

Relacionamentos:

* pertence a Note
* pertence a Tag

Regras:

* usar chave composta entre noteId e tagId
* serve para relação muitos-para-muitos entre Note e Tag

Comparison:

* id
* noteId único
* problem opcional
* conclusion opcional
* createdAt
* updatedAt

Relacionamentos:

* uma Comparison pertence a uma Note
* uma Comparison possui várias ComparisonOptions

Importante:
A comparação NÃO deve ser limitada a opção A e opção B.
Não criar campos fixos como optionA, optionB, whenUseA, whenUseB, advantagesA e advantagesB.
A comparação deve aceitar quantas opções forem necessárias através do model ComparisonOption.

ComparisonOption:

* id
* comparisonId
* title
* description opcional
* whenUse opcional
* advantages opcional
* disadvantages opcional
* attentionPoints opcional
* example opcional
* order

Relacionamentos:

* uma ComparisonOption pertence a uma Comparison

Objetivo:
Permitir comparações flexíveis como:

* Fetch vs Axios
* Fetch vs Axios vs React Query
* Supino reto vs inclinado vs declinado
* SQL vs NoSQL vs NewSQL

Snippet:

* id
* noteId
* language
* code
* explanation opcional
* createdAt
* updatedAt

Relacionamentos:

* um Snippet pertence a uma Note
* uma Note pode ter vários Snippets

Regras gerais:

* Usar nomes claros.
* Usar createdAt com default now().
* Usar updatedAt com @updatedAt.
* Usar relações bem definidas no Prisma.
* Usar onDelete adequado para evitar dados órfãos quando fizer sentido.
* Não implementar seed nesta fase.
* Não implementar rotas de API nesta fase.
* Não substituir os mocks nesta fase.
* Não criar tela nova nesta fase.

Arquivos esperados:

* prisma/schema.prisma
* .env.example
* package.json alterado com dependências do Prisma, se necessário
* .gitignore atualizado, se necessário

Ao finalizar:

1. Explique quais arquivos foram criados.
2. Explique quais arquivos foram alterados.
3. Explique a modelagem criada em linguagem simples.
4. Confirme que Comparison suporta múltiplas opções através de ComparisonOption.
5. Confirme que não adicionou autenticação, login real, IA, API real ou CRUD real.
6. Confirme que os mocks atuais continuam funcionando.
7. Rode npm run build.
8. Informe se o build passou.
9. Informe o próximo passo recomendado para a Fase 3B.
