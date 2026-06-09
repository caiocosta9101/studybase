import { Note, NoteType } from "@/types/note";

export const noteTypeConfig: Record<NoteType, { label: string; className: string }> = {
  SIMPLE: {
    label: "Anotação simples",
    className: "border-sky-200 bg-sky-50 text-sky-700"
  },
  GUIDE: {
    label: "Guia",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700"
  },
  COMPARISON: {
    label: "Comparação",
    className: "border-violet-200 bg-violet-50 text-violet-700"
  },
  SNIPPET: {
    label: "Snippet",
    className: "border-amber-200 bg-amber-50 text-amber-700"
  },
  ERROR_SOLUTION: {
    label: "Erro e solução",
    className: "border-rose-200 bg-rose-50 text-rose-700"
  }
};

export const mockNotes: Note[] = [
  {
    id: "fetch-vs-axios",
    title: "Fetch vs Axios",
    description: "Comparação prática para decidir quando usar a API nativa do navegador ou uma biblioteca HTTP.",
    content:
      "Fetch e Axios resolvem a mesma dor principal: fazer requisições HTTP. A diferença aparece na experiência de uso, tratamento de erros, interceptadores e configuração padrão.\n\nUse Fetch quando o projeto precisa de algo simples, com poucas dependências e bom suporte nativo. Use Axios quando a aplicação precisa de interceptadores, configuração global e uma experiência mais consistente para times maiores.",
    type: "COMPARISON",
    typeLabel: "Comparação",
    area: "Programação",
    category: "APIs",
    tags: ["HTTP", "JavaScript", "Front-end"],
    isFavorite: true,
    updatedAt: "Hoje",
    readingTime: "6 min",
    highlights: ["Fetch já vem no navegador.", "Axios simplifica interceptadores.", "Ambos funcionam bem em projetos reais."],
    comparison: [
      {
        label: "Fetch",
        points: ["Nativo do navegador", "Não adiciona dependência", "Exige mais código para erros e JSON"]
      },
      {
        label: "Axios",
        points: ["Tem interceptadores", "Boa configuração global", "Adiciona uma dependência ao projeto"]
      }
    ]
  },
  {
    id: "take-your-time",
    title: "Take your time",
    description: "Expressão em inglês usada para dizer que a pessoa pode fazer algo com calma.",
    content:
      "Take your time significa algo como 'faça com calma' ou 'sem pressa'. É uma forma educada de mostrar que a outra pessoa não precisa correr.\n\nExemplo: Take your time, we are not late.",
    type: "SIMPLE",
    typeLabel: "Anotação simples",
    area: "Inglês",
    category: "Expressões",
    tags: ["Speaking", "Frases úteis", "Conversação"],
    isFavorite: true,
    updatedAt: "Ontem",
    readingTime: "2 min",
    highlights: ["Não significa tomar o tempo de alguém.", "Passa tranquilidade.", "Muito comum em conversas do dia a dia."]
  },
  {
    id: "supino-reto-vs-inclinado",
    title: "Supino reto vs inclinado",
    description: "Comparação simples entre variações de supino e foco muscular de cada movimento.",
    content:
      "O supino reto tende a trabalhar o peitoral de forma mais geral, com participação de tríceps e deltoide anterior. O supino inclinado aumenta o foco na porção superior do peitoral e exige cuidado com carga e amplitude.\n\nA escolha depende do objetivo do treino, técnica e equilíbrio do volume semanal.",
    type: "COMPARISON",
    typeLabel: "Comparação",
    area: "Saúde",
    category: "Musculação",
    tags: ["Treino", "Peitoral", "Exercícios"],
    isFavorite: false,
    updatedAt: "2 dias atrás",
    readingTime: "4 min",
    highlights: ["Reto é mais geral.", "Inclinado enfatiza a parte superior.", "Técnica pesa mais que carga."],
    comparison: [
      {
        label: "Supino reto",
        points: ["Foco amplo no peitoral", "Costuma permitir mais carga", "Bom movimento base"]
      },
      {
        label: "Supino inclinado",
        points: ["Maior ênfase no peitoral superior", "Exige controle do ombro", "Boa variação complementar"]
      }
    ]
  },
  {
    id: "regra-100-eap",
    title: "Regra dos 100% na EAP",
    description: "Guia rápido sobre como conferir se uma Estrutura Analítica do Projeto cobre todo o escopo.",
    content:
      "A regra dos 100% diz que a EAP deve representar 100% do trabalho necessário para entregar o projeto, sem incluir trabalho fora do escopo.\n\nNa prática, cada nível da EAP deve decompor completamente o nível acima. Se um pacote de trabalho não contribui para uma entrega, ele provavelmente não pertence à EAP.",
    type: "GUIDE",
    typeLabel: "Guia",
    area: "Projetos",
    category: "Gestão",
    tags: ["EAP", "Escopo", "PMBOK"],
    isFavorite: false,
    updatedAt: "3 dias atrás",
    readingTime: "5 min",
    highlights: ["A EAP cobre todo o escopo aprovado.", "Não deve conter trabalho extra.", "Ajuda a evitar lacunas na entrega."]
  },
  {
    id: "controle-gastos-fixos",
    title: "Controle de gastos fixos",
    description: "Modelo simples para separar custos recorrentes e entender o impacto no orçamento mensal.",
    content:
      "Gastos fixos são despesas recorrentes que tendem a aparecer todos os meses, como aluguel, internet, transporte, academia e assinaturas.\n\nUma boa revisão mensal separa valor, vencimento, prioridade e possibilidade de renegociação. Isso deixa claro quanto da renda já está comprometida antes dos gastos variáveis.",
    type: "GUIDE",
    typeLabel: "Guia",
    area: "Finanças",
    category: "Orçamento",
    tags: ["Planejamento", "Mensal", "Custos"],
    isFavorite: true,
    updatedAt: "1 semana atrás",
    readingTime: "4 min",
    highlights: ["Custos fixos mostram a renda comprometida.", "Vencimento ajuda no fluxo de caixa.", "Revisão mensal evita assinaturas esquecidas."]
  },
  {
    id: "prisma-client-initialization-error",
    title: "Erro: PrismaClientInitializationError",
    description: "Registro de erro comum ao iniciar o Prisma sem conexão válida com o banco.",
    content:
      "Esse erro costuma aparecer quando a aplicação tenta iniciar o Prisma Client e não consegue conectar ao banco. As causas comuns são DATABASE_URL ausente, credenciais incorretas, banco fora do ar ou schema ainda não migrado.\n\nA primeira verificação deve ser a variável de ambiente e o status do banco.",
    type: "ERROR_SOLUTION",
    typeLabel: "Erro e solução",
    area: "Banco de Dados",
    category: "Erros",
    tags: ["Prisma", "PostgreSQL", "Debug"],
    isFavorite: true,
    updatedAt: "1 semana atrás",
    readingTime: "5 min",
    highlights: ["Conferir DATABASE_URL.", "Validar se o banco está acessível.", "Rodar migrations na fase certa do projeto."],
    solution:
      "Conferir o arquivo de variáveis de ambiente, validar a string de conexão, testar o acesso ao banco e executar as migrations quando a fase de banco de dados for implementada."
  },
  {
    id: "snippet-normalizar-busca",
    title: "Snippet: normalizar termo de busca",
    description: "Pequeno trecho TypeScript para padronizar a busca por texto no front-end.",
    content:
      "Normalizar o termo evita diferença entre maiúsculas, minúsculas e espaços acidentais. Na Fase 2 esse tipo de snippet pode ser usado na busca local.",
    type: "SNIPPET",
    typeLabel: "Snippet",
    area: "Programação",
    category: "TypeScript",
    tags: ["Busca", "TypeScript", "Front-end"],
    isFavorite: false,
    updatedAt: "2 semanas atrás",
    readingTime: "3 min",
    highlights: ["Remove espaços extras.", "Padroniza letras minúsculas.", "Facilita filtros locais."],
    code: "const termoNormalizado = termo.trim().toLowerCase();"
  }
];

export const areas = [
  { name: "Programação", count: 42, description: "Conceitos, snippets, comparações técnicas, APIs e frameworks." },
  { name: "Inglês", count: 18, description: "Expressões, frases úteis, vocabulário e regras de uso." },
  { name: "Saúde", count: 11, description: "Treinos, hábitos, alimentação e observações pessoais." },
  { name: "Projetos", count: 15, description: "Gestão, planejamento, escopo, processos e decisões." },
  { name: "Finanças", count: 9, description: "Orçamento, custos, metas e controle de gastos." },
  { name: "Banco de Dados", count: 14, description: "SQL, PostgreSQL, Prisma, erros e modelagem." }
];

export const categories = [
  "APIs",
  "Expressões",
  "Musculação",
  "Gestão",
  "Orçamento",
  "Erros",
  "TypeScript",
  "Snippets"
];

export const tags = Array.from(new Set(mockNotes.flatMap((note) => note.tags)));

export const noteTypeSummary = [
  { type: "SIMPLE" as const, count: 34, width: "62%" },
  { type: "GUIDE" as const, count: 29, width: "54%" },
  { type: "COMPARISON" as const, count: 24, width: "46%" },
  { type: "SNIPPET" as const, count: 21, width: "40%" },
  { type: "ERROR_SOLUTION" as const, count: 20, width: "38%" }
];
