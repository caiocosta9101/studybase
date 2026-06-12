import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { NoteType, PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não definida.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({ adapter });

async function connectTagsToNote(noteId: string, tagIds: string[]) {
  for (const tagId of tagIds) {
    await prisma.noteTag.upsert({
      where: {
        noteId_tagId: {
          noteId,
          tagId,
        },
      },
      update: {},
      create: {
        noteId,
        tagId,
      },
    });
  }
}

async function main() {
  const user = await prisma.user.upsert({
    where: {
      email: "usuario.seed@studybase.local",
    },
    update: {
      name: "Usuário Seed",
      passwordHash: null,
    },
    create: {
      name: "Usuário Seed",
      email: "usuario.seed@studybase.local",
      passwordHash: null,
    },
  });

  const programacao = await prisma.area.upsert({
    where: {
      slug: "programacao",
    },
    update: {
      name: "Programação",
      description: "Estudos sobre desenvolvimento de software.",
    },
    create: {
      name: "Programação",
      slug: "programacao",
      description: "Estudos sobre desenvolvimento de software.",
    },
  });

  const ingles = await prisma.area.upsert({
    where: {
      slug: "ingles",
    },
    update: {
      name: "Inglês",
      description: "Vocabulário, regras e expressões em inglês.",
    },
    create: {
      name: "Inglês",
      slug: "ingles",
      description: "Vocabulário, regras e expressões em inglês.",
    },
  });

  const saude = await prisma.area.upsert({
    where: {
      slug: "saude",
    },
    update: {
      name: "Saúde",
      description: "Anotações sobre treino, hábitos e nutrição.",
    },
    create: {
      name: "Saúde",
      slug: "saude",
      description: "Anotações sobre treino, hábitos e nutrição.",
    },
  });

  const bancoDeDados = await prisma.category.upsert({
    where: {
      areaId_slug: {
        areaId: programacao.id,
        slug: "banco-de-dados",
      },
    },
    update: {
      name: "Banco de Dados",
    },
    create: {
      name: "Banco de Dados",
      slug: "banco-de-dados",
      areaId: programacao.id,
    },
  });

  const nextJs = await prisma.category.upsert({
    where: {
      areaId_slug: {
        areaId: programacao.id,
        slug: "next-js",
      },
    },
    update: {
      name: "Next.js",
    },
    create: {
      name: "Next.js",
      slug: "next-js",
      areaId: programacao.id,
    },
  });

  const verbToBe = await prisma.category.upsert({
    where: {
      areaId_slug: {
        areaId: ingles.id,
        slug: "verb-to-be",
      },
    },
    update: {
      name: "Verb to be",
    },
    create: {
      name: "Verb to be",
      slug: "verb-to-be",
      areaId: ingles.id,
    },
  });

  const vocabulary = await prisma.category.upsert({
    where: {
      areaId_slug: {
        areaId: ingles.id,
        slug: "vocabulary",
      },
    },
    update: {
      name: "Vocabulary",
    },
    create: {
      name: "Vocabulary",
      slug: "vocabulary",
      areaId: ingles.id,
    },
  });

  const treino = await prisma.category.upsert({
    where: {
      areaId_slug: {
        areaId: saude.id,
        slug: "treino",
      },
    },
    update: {
      name: "Treino",
    },
    create: {
      name: "Treino",
      slug: "treino",
      areaId: saude.id,
    },
  });

  const nutricao = await prisma.category.upsert({
    where: {
      areaId_slug: {
        areaId: saude.id,
        slug: "nutricao",
      },
    },
    update: {
      name: "Nutrição",
    },
    create: {
      name: "Nutrição",
      slug: "nutricao",
      areaId: saude.id,
    },
  });

  const prismaTag = await prisma.tag.upsert({
    where: {
      slug: "prisma",
    },
    update: {
      name: "Prisma",
    },
    create: {
      name: "Prisma",
      slug: "prisma",
    },
  });

  const bancoTag = await prisma.tag.upsert({
    where: {
      slug: "banco-de-dados",
    },
    update: {
      name: "Banco de Dados",
    },
    create: {
      name: "Banco de Dados",
      slug: "banco-de-dados",
    },
  });

  const inglesTag = await prisma.tag.upsert({
    where: {
      slug: "ingles",
    },
    update: {
      name: "Inglês",
    },
    create: {
      name: "Inglês",
      slug: "ingles",
    },
  });

  const treinoTag = await prisma.tag.upsert({
    where: {
      slug: "treino",
    },
    update: {
      name: "Treino",
    },
    create: {
      name: "Treino",
      slug: "treino",
    },
  });

  const snippetTag = await prisma.tag.upsert({
    where: {
      slug: "snippet",
    },
    update: {
      name: "Snippet",
    },
    create: {
      name: "Snippet",
      slug: "snippet",
    },
  });

  const prismaNote = await prisma.note.upsert({
    where: {
      slug: "o-que-e-prisma",
    },
    update: {
      title: "O que é Prisma?",
      summary: "Visão geral sobre o Prisma ORM.",
      content: "Prisma ajuda a modelar, migrar e acessar o banco com TypeScript.",
      type: NoteType.GUIDE,
      favorite: true,
      areaId: programacao.id,
      categoryId: bancoDeDados.id,
      userId: user.id,
    },
    create: {
      title: "O que é Prisma?",
      slug: "o-que-e-prisma",
      summary: "Visão geral sobre o Prisma ORM.",
      content: "Prisma ajuda a modelar, migrar e acessar o banco com TypeScript.",
      type: NoteType.GUIDE,
      favorite: true,
      areaId: programacao.id,
      categoryId: bancoDeDados.id,
      userId: user.id,
    },
  });

  const verbNote = await prisma.note.upsert({
    where: {
      slug: "regras-do-verb-to-be",
    },
    update: {
      title: "Regras do verb to be",
      summary: "Uso básico de am, is e are.",
      content: "Use am com I, is com he/she/it e are com you/we/they.",
      type: NoteType.SIMPLE,
      favorite: false,
      areaId: ingles.id,
      categoryId: verbToBe.id,
      userId: user.id,
    },
    create: {
      title: "Regras do verb to be",
      slug: "regras-do-verb-to-be",
      summary: "Uso básico de am, is e are.",
      content: "Use am com I, is com he/she/it e are com you/we/they.",
      type: NoteType.SIMPLE,
      favorite: false,
      areaId: ingles.id,
      categoryId: verbToBe.id,
      userId: user.id,
    },
  });

  const treinoNote = await prisma.note.upsert({
    where: {
      slug: "organizacao-de-treino-semanal",
    },
    update: {
      title: "Organização de treino semanal",
      summary: "Exemplo simples de divisão de treino.",
      content: "Distribua os grupos musculares durante a semana e reserve tempo para descanso.",
      type: NoteType.GUIDE,
      favorite: false,
      areaId: saude.id,
      categoryId: treino.id,
      userId: user.id,
    },
    create: {
      title: "Organização de treino semanal",
      slug: "organizacao-de-treino-semanal",
      summary: "Exemplo simples de divisão de treino.",
      content: "Distribua os grupos musculares durante a semana e reserve tempo para descanso.",
      type: NoteType.GUIDE,
      favorite: false,
      areaId: saude.id,
      categoryId: treino.id,
      userId: user.id,
    },
  });

  const comparisonNote = await prisma.note.upsert({
    where: {
      slug: "prisma-vs-sql-puro",
    },
    update: {
      title: "Prisma vs SQL puro",
      summary: "Comparação entre usar ORM e escrever SQL manualmente.",
      content: "As duas abordagens podem funcionar bem, mas atendem a necessidades diferentes.",
      type: NoteType.COMPARISON,
      favorite: true,
      areaId: programacao.id,
      categoryId: bancoDeDados.id,
      userId: user.id,
    },
    create: {
      title: "Prisma vs SQL puro",
      slug: "prisma-vs-sql-puro",
      summary: "Comparação entre usar ORM e escrever SQL manualmente.",
      content: "As duas abordagens podem funcionar bem, mas atendem a necessidades diferentes.",
      type: NoteType.COMPARISON,
      favorite: true,
      areaId: programacao.id,
      categoryId: bancoDeDados.id,
      userId: user.id,
    },
  });

  const snippetNote = await prisma.note.upsert({
    where: {
      slug: "exemplo-basico-de-comando-prisma",
    },
    update: {
      title: "Exemplo básico de comando Prisma",
      summary: "Comando simples para criar uma migration.",
      content: "Snippet para lembrar o comando inicial de migration em ambiente local.",
      type: NoteType.SNIPPET,
      favorite: false,
      areaId: programacao.id,
      categoryId: bancoDeDados.id,
      userId: user.id,
    },
    create: {
      title: "Exemplo básico de comando Prisma",
      slug: "exemplo-basico-de-comando-prisma",
      summary: "Comando simples para criar uma migration.",
      content: "Snippet para lembrar o comando inicial de migration em ambiente local.",
      type: NoteType.SNIPPET,
      favorite: false,
      areaId: programacao.id,
      categoryId: bancoDeDados.id,
      userId: user.id,
    },
  });

  const errorNote = await prisma.note.upsert({
    where: {
      slug: "erro-de-conexao-no-postgresql-local",
    },
    update: {
      title: "Erro de conexão no PostgreSQL local",
      summary: "Checklist básico quando o Prisma não conecta no banco local.",
      content: "Verifique se o PostgreSQL está rodando, se o banco existe e se a DATABASE_URL local está correta.",
      type: NoteType.ERROR_SOLUTION,
      favorite: false,
      areaId: programacao.id,
      categoryId: bancoDeDados.id,
      userId: user.id,
    },
    create: {
      title: "Erro de conexão no PostgreSQL local",
      slug: "erro-de-conexao-no-postgresql-local",
      summary: "Checklist básico quando o Prisma não conecta no banco local.",
      content: "Verifique se o PostgreSQL está rodando, se o banco existe e se a DATABASE_URL local está correta.",
      type: NoteType.ERROR_SOLUTION,
      favorite: false,
      areaId: programacao.id,
      categoryId: bancoDeDados.id,
      userId: user.id,
    },
  });

  await connectTagsToNote(prismaNote.id, [prismaTag.id, bancoTag.id]);
  await connectTagsToNote(verbNote.id, [inglesTag.id]);
  await connectTagsToNote(treinoNote.id, [treinoTag.id]);
  await connectTagsToNote(comparisonNote.id, [prismaTag.id, bancoTag.id]);
  await connectTagsToNote(snippetNote.id, [prismaTag.id, snippetTag.id]);
  await connectTagsToNote(errorNote.id, [bancoTag.id]);

  const comparison = await prisma.comparison.upsert({
    where: {
      noteId: comparisonNote.id,
    },
    update: {
      problem: "Escolher a melhor forma de acessar dados em uma aplicação TypeScript.",
      conclusion: "Prisma é produtivo para CRUD e modelagem; SQL puro dá controle máximo quando necessário.",
    },
    create: {
      noteId: comparisonNote.id,
      problem: "Escolher a melhor forma de acessar dados em uma aplicação TypeScript.",
      conclusion: "Prisma é produtivo para CRUD e modelagem; SQL puro dá controle máximo quando necessário.",
    },
  });

  await prisma.comparisonOption.deleteMany({
    where: {
      comparisonId: comparison.id,
    },
  });

  await prisma.comparisonOption.createMany({
    data: [
      {
        comparisonId: comparison.id,
        title: "Prisma",
        description: "ORM com schema declarativo, migrations e client tipado.",
        whenUse: "Quando produtividade, tipos e organização do acesso ao banco forem prioridade.",
        advantages: "Boa integração com TypeScript, migrations e autocomplete.",
        disadvantages: "Pode esconder detalhes importantes do SQL em consultas complexas.",
        attentionPoints: "Ainda é importante entender o banco por baixo.",
        example: "Buscar notas com prisma.note.findMany().",
        order: 1,
      },
      {
        comparisonId: comparison.id,
        title: "SQL puro",
        description: "Consultas escritas diretamente na linguagem SQL.",
        whenUse: "Quando a consulta precisa de controle fino ou otimização específica.",
        advantages: "Controle total sobre a query e comportamento do banco.",
        disadvantages: "Mais responsabilidade manual com tipagem, organização e manutenção.",
        attentionPoints: "Requer cuidado com parâmetros e segurança.",
        example: "SELECT * FROM notes WHERE favorite = true;",
        order: 2,
      },
      {
        comparisonId: comparison.id,
        title: "Query Builder",
        description: "Camada intermediária para montar SQL com uma API programática.",
        whenUse: "Quando é útil ter mais controle que um ORM sem escrever tudo manualmente.",
        advantages: "Flexível e mais próximo do SQL.",
        disadvantages: "Pode exigir mais código que um ORM completo.",
        attentionPoints: "A legibilidade depende bastante do padrão usado pelo projeto.",
        example: "Montar filtros dinâmicos para uma listagem.",
        order: 3,
      },
    ],
  });

  await prisma.snippet.deleteMany({
    where: {
      noteId: snippetNote.id,
    },
  });

  await prisma.snippet.create({
    data: {
      noteId: snippetNote.id,
      language: "bash",
      code: "npx prisma migrate dev --name init",
      explanation: "Cria uma migration de desenvolvimento usando o schema atual do Prisma.",
    },
  });

  console.log("Seed da Fase 3B preparado com dados fake do StudyBase.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
