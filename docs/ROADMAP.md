# Roadmap — StudyBase

Este documento registra o plano geral de evolução do StudyBase.

O objetivo do roadmap é orientar as próximas fases do projeto sem misturar detalhes operacionais, comandos executados ou histórico técnico completo.

Para o estado atual do projeto, consultar:

```txt
docs/PROJECT_STATUS.md
```

Para regras gerais do projeto, consultar:

```txt
AGENTS.md
```

---

## Objetivo do StudyBase

O StudyBase é uma base pessoal de conhecimento para organizar estudos, programação, inglês, comandos, comparações técnicas, snippets de código, erros comuns e soluções práticas.

O projeto deve evoluir de forma gradual, com etapas pequenas, seguras e bem documentadas.

---

## Status geral das fases

| Fase     | Nome                                       | Status       |
| -------- | ------------------------------------------ | ------------ |
| Fase 1   | Base visual                                | Concluída    |
| Fase 1.1 | Refinamento visual                         | Concluída    |
| Fase 2   | Funcionalidades com dados mockados         | Concluída    |
| Fase 2.1 | Validações e UX com dados mockados         | Concluída    |
| Fase 3A  | Prisma e schema inicial                    | Concluída    |
| Fase 3B  | PostgreSQL local, migration e seed         | Concluída    |
| Fase 3C  | Planejamento da integração dos dados reais | Concluída    |
| Fase 3D  | Leitura real do banco com Prisma           | Concluída    |
| Fase 4   | Autenticação real                          | Concluída    |
| Fase 5   | Fluxos persistentes e refinamento           | Em andamento |
| Fase 6   | Funcionalidades futuras                    | Futuro       |

---

## Fase 1 — Base visual

Objetivo: criar a base visual inicial da aplicação.

Inclui:

* layout base;
* tela inicial;
* dashboard estático;
* cards de exemplo;
* busca visual;
* filtros visuais;
* listagem estática.

Status: concluída.

---

## Fase 1.1 — Refinamento visual

Objetivo: melhorar a aparência e a experiência visual inicial.

Inclui:

* ajustes de layout;
* melhoria dos cards;
* refinamento de espaçamentos;
* melhor organização visual;
* aparência mais profissional.

Status: concluída.

---

## Fase 2 — Funcionalidades com dados mockados

Objetivo: simular o funcionamento principal do sistema sem banco de dados real.

Inclui:

* tipos TypeScript;
* dados mockados;
* listagem de anotações;
* detalhes de anotação;
* busca no front-end;
* filtros no front-end;
* favoritos simulados;
* criação simulada.

Status: concluída.

---

## Fase 2.1 — Validações e UX com dados mockados

Objetivo: melhorar a experiência do usuário ainda usando dados mockados.

Inclui:

* validações de formulário;
* mensagens de erro;
* estados vazios;
* melhorias de fluxo;
* ajustes de usabilidade.

Status: concluída.

---

## Fase 3A — Prisma e schema inicial

Objetivo: configurar a base do Prisma e modelar os dados principais do StudyBase.

Inclui:

* configuração inicial do Prisma;
* criação/revisão do schema;
* models principais;
* enums;
* relacionamentos principais.

Status: concluída.

---

## Fase 3B — PostgreSQL local, migration e seed

Objetivo: conectar o projeto a um PostgreSQL local e validar a estrutura real do banco.

Inclui:

* PostgreSQL local;
* banco `studybase_dev`;
* configuração segura de ambiente;
* migration inicial;
* seed com dados fake;
* validação no Prisma Studio;
* build final validado.

Status: concluída.

---

## Fase 3C — Planejamento da integração dos dados reais

Objetivo: planejar como substituir os dados mockados por dados reais do PostgreSQL.

Esta fase é apenas de diagnóstico e planejamento.

Inclui:

* mapear arquivos que usam mocks;
* identificar telas que dependem de mocks;
* comparar os mocks atuais com o `schema.prisma`;
* verificar se o seed cobre a interface atual;
* decidir uma estratégia simples para leitura real com Prisma;
* documentar riscos e próximos passos.

Nesta fase não implementar:

* CRUD real;
* autenticação real;
* IA;
* rotas de API sem aprovação;
* grandes refatorações.

Status: concluida.

---

## Fase 3D — Leitura real do banco com Prisma

Objetivo: substituir as leituras relevantes baseadas em mocks por dados reais do banco.

entregas da fase:

* criar camada simples de acesso aos dados;
* listar notas reais;
* carregar áreas reais;
* carregar categorias reais;
* carregar tags reais;
* carregar detalhes de uma nota real;
* integrar o dashboard com dados reais;
* manter a aplicação funcionando sem CRUD real inicialmente.

Status: concluída.

Entregas já concluídas:

* rota `/` integrada com métricas e notas recentes reais;
* listagem real de notas em `/anotacoes` usando PostgreSQL + Prisma;
* detalhes reais de notas em `/anotacoes/[id]` usando `slug`;
* dashboard integrado com dados reais usando Prisma;
* `/favoritos` integrada com leitura real usando Prisma, mantendo a remoção apenas visual e local.
* `/areas` integrada com leitura real e navegação para `/anotacoes?area=<slug>`.
* `/tags` integrada com leitura real e navegação para `/anotacoes?tag=<slug>`.
* Prisma isolado no servidor, com consultas de leitura centralizadas em `src/lib/notes/queries.ts`;
* interações de favorito mantidas apenas visuais e locais, sem escrita no banco.

Situação posterior:

* a Fase 4 foi concluída pelas subfases 4A, 4B, 4C e 4D.

---

## Fase 4 — Autenticação real

Objetivo: implementar autenticação depois que a leitura real dos dados estiver estável.

Inclui:

* cadastro;
* login;
* senha com hash;
* sessão stateless em cookie assinado;
* proteção de rotas;
* vínculo das anotações ao usuário autenticado.

Status: concluída.

### Fase 4A — Ativação segura da conta inicial

Status: concluída.

A conta inicial existente recebeu uma credencial segura por script local, usando hash com `scrypt`. A conta e as notas já vinculadas foram preservadas.

### Fase 4B — Login, logout e sessão

Status: concluída.

Foram implementados:

* página `/login` sem o shell principal;
* validação server-side das credenciais;
* login e logout por Server Actions;
* sessão stateless em cookie assinado com HMAC-SHA-256;
* payload versionado com duração de sete dias;
* leitura e validação server-side da sessão;
* redirecionamento de `/login` quando a sessão é válida;
* botão de logout acessível na sidebar;
* documentação segura de `SESSION_SECRET` em `.env.example`.

Os limites aprovados para a Fase 4B foram tratados na subfase seguinte.

### Fase 4C — Proteção de acesso e leituras isoladas por usuário

Status: concluída.

Foram implementados:

* `requireCurrentUser` reutilizando a sessão existente;
* proteção server-side de `/`, `/dashboard`, `/anotacoes`, `/anotacoes/[id]`, `/favoritos`, `/areas`, `/tags`, `/anotacoes/nova` e `/configuracoes`;
* manutenção de `/login` como rota pública;
* isolamento das nove consultas reais de leitura pelo `userId` autenticado;
* filtro de ownership em notas, favoritos, métricas, contagens e agregações;
* áreas, categorias e tags globais no schema, mas apresentadas somente pelas relações com notas do usuário;
* detalhe de nota consultado por `slug` e `userId`, com `404` para nota inexistente ou fora do ownership;
* separação de `/anotacoes/nova` em Server Page protegida e Client Component mockado;
* Prisma mantido exclusivamente no servidor, sem `proxy.ts`, nova dependência, migration, seed ou variável de ambiente.

As rotas internas e as leituras reais estão protegidas e isoladas. O isolamento horizontal foi posteriormente validado na Fase 4D com uma conta nova sem dados próprios.

### Fase 4D — Cadastro de usuário

Status: concluída.

Foram implementados:

* página pública `/cadastro` como Server Component;
* cadastro por Server Action com validações server-side;
* normalização de nome e e-mail;
* senha com o hash `scrypt` existente, sem alterar seu valor com `trim`;
* confirmação de senha e tratamento controlado de e-mail duplicado;
* criação do usuário já com `passwordHash`;
* autenticação automática com a sessão stateless existente;
* redirecionamento para `/dashboard` após sucesso;
* fallback para `/login` quando a conta é criada, mas a sessão falha;
* redirecionamento server-side de usuário autenticado que acessa `/cadastro`;
* integração visual de `/cadastro` sem sidebar e links entre cadastro e login;
* validação runtime de uma conta nova com zero dados e sem acesso aos dados da conta inicial.

O objetivo `cadastro` está concluído. Todos os objetivos explicitamente definidos para a Fase 4 foram implementados e validados.

Funcionalidades ainda não implementadas, mas não exigidas pelo roadmap para concluir a Fase 4:

* recuperação ou troca de senha;
* rate limiting;
* sessão persistida no banco;
* revogação individual de sessões stateless.

Situação da Fase 4: concluída. A próxima evolução do projeto deve ser avaliada dentro da Fase 5, sem antecipar funcionalidades não aprovadas.

---

## Fase 5 — Fluxos persistentes e refinamento com dados reais

Objetivo: substituir os fluxos locais ou mockados restantes por fluxos reais e persistentes aprovados, consolidar o CRUD do MVP e refinar busca, filtros, estados e apresentação sobre dados reais.

Status: em andamento.

### Fase 5A — Criação real de anotações básicas

Objetivo: implementar a criação persistente de `SIMPLE`, `GUIDE` e `ERROR_SOLUTION`, com catálogo global real de áreas, categorias e tags, ownership da sessão e favorito inicial opcional.

Status: concluída.

Commit de implementação: `4761324 feat: implementa criacao real de anotacoes`.

### Fase 5B — Edição real de anotações básicas

Objetivo: permitir a edição persistente das notas básicas pertencentes ao usuário autenticado, mantendo o tipo e o slug estáveis.

Status: concluída.

Foram entregues:

* edição persistente de notas próprias `SIMPLE`, `GUIDE` e `ERROR_SOLUTION`;
* rota protegida `/anotacoes/[id]/editar` com ownership obtido da sessão;
* manutenção do tipo imutável e do slug estável;
* edição de título, resumo, conteúdo, área, categoria, tags e favorito;
* validações server-side do formulário e do catálogo global;
* substituição atômica das tags junto com a atualização da nota;
* revalidação das leituras afetadas após a persistência confirmada.

Commit de implementação: `6f9496c feat: implementa edicao real de anotacoes`.

### Fase 5C — Exclusão real e fechamento do CRUD básico

Objetivo: permitir a exclusão permanente e confirmada das notas básicas próprias, garantindo consistência funcional imediata das leituras afetadas.

Status: pendente.

### Fase 5D — Favoritos persistentes

Objetivo: substituir as ações rápidas locais de favorito por mutações persistentes e refletir o estado real nas telas relacionadas.

Status: pendente.

### Fase 5E — CRUD estruturado de `SNIPPET`

Objetivo: implementar criação, edição e exclusão de snippets preservando seus dados estruturados.

Pré-requisito: revisão e aprovação específica das regras funcionais mínimas de `SNIPPET` antes de qualquer planejamento de implementação.

Status: pendente.

### Fase 5F — CRUD estruturado de `COMPARISON`

Objetivo: implementar criação, edição e exclusão de comparações com suas opções estruturadas.

Pré-requisito: revisão e aprovação específica das regras funcionais mínimas de `COMPARISON` antes de qualquer planejamento de implementação.

Status: pendente.

### Fase 5G — Refinamento de busca e filtros

Objetivo: aprimorar a busca e os filtros combinados depois que os fluxos persistentes principais estiverem consistentes.

Status: pendente.

### Fase 5H — Estados, consistência visual e fechamento funcional

Objetivo: consolidar loading states, empty states, mensagens de erro, conteúdo e ajustes visuais alinhados aos fluxos reais.

Status: pendente.

Produção, banco de produção e deploy não fazem parte da Fase 5. Depois da conclusão da Fase 5H deverá ocorrer uma revisão separada de prontidão para produção/deploy, ainda sem nome ou numeração definidos.

Próxima subfase: Fase 5C — Exclusão real e fechamento do CRUD básico.

---

## Fase 6 — Funcionalidades futuras

Objetivo: avaliar funcionalidades avançadas somente depois do MVP estar sólido.

Possibilidades futuras:

* inteligência artificial;
* sugestão automática de tags;
* resumo automático;
* busca semântica;
* revisão espaçada;
* exportação;
* upload de arquivos.

Status: futuro.

---

## Regras de avanço

Antes de iniciar uma nova fase:

1. Confirmar que a fase anterior foi validada.
2. Rodar os comandos necessários de verificação.
3. Revisar o `git status`.
4. Fazer commit da fase anterior.
5. Atualizar o `PROJECT_STATUS.md`.
6. Planejar a próxima fase antes de implementar código.

---

## Observações importantes

* Não implementar autenticação antes da Fase 4.
* Não implementar IA antes da Fase 6 ou decisão explícita.
* Não substituir tudo de uma vez.
* Não fazer grandes refatorações sem aprovação.
* Priorizar código simples, seguro e fácil de manter.
