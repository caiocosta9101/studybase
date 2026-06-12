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
| Fase 3C  | Planejamento da integração dos dados reais | Próxima fase |
| Fase 3D  | Leitura real do banco com Prisma           | Pendente     |
| Fase 4   | Autenticação real                          | Pendente     |
| Fase 5   | Refinamento com dados reais                | Pendente     |
| Fase 6   | Funcionalidades futuras                    | Pendente     |

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

Objetivo: começar a substituir os mocks por dados reais do banco.

Possíveis entregas:

* criar camada simples de acesso aos dados;
* listar notas reais;
* carregar áreas reais;
* carregar categorias reais;
* carregar tags reais;
* carregar detalhes de uma nota real;
* manter a aplicação funcionando sem CRUD real inicialmente.

Status: proxima fase.

---

## Fase 4 — Autenticação real

Objetivo: implementar autenticação depois que a leitura real dos dados estiver estável.

Inclui:

* cadastro;
* login;
* senha com hash;
* sessão com JWT/cookie;
* proteção de rotas;
* vínculo das anotações ao usuário autenticado.

Status: pendente.

---

## Fase 5 — Refinamento com dados reais

Objetivo: melhorar a experiência da aplicação já funcionando com dados reais.

Inclui:

* favoritos reais;
* tags;
* categorias;
* busca melhorada;
* filtros combinados;
* loading states;
* empty states;
* mensagens de erro;
* ajustes visuais.

Status: pendente.

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
