# AGENTS.md — Instruções para o Codex

## Contexto do projeto

Este projeto se chama **StudyBase**.

O StudyBase é uma base pessoal de conhecimento para organizar estudos, programação, inglês, comandos, comparações técnicas, snippets de código, erros comuns e soluções práticas.

O objetivo não é criar um app genérico de notas como Notion ou Obsidian.

O objetivo é criar uma ferramenta mais direta e estruturada para o usuário salvar aprendizados e encontrar depois com facilidade.

## Objetivo principal

Criar uma aplicação web onde o usuário possa:

* cadastrar anotações;
* organizar por área;
* organizar por categoria;
* adicionar tags;
* pesquisar por palavra-chave;
* favoritar conteúdos importantes;
* criar comparações técnicas;
* salvar snippets de código;
* registrar erros e soluções.

## Stack planejada

Usar preferencialmente:

* Next.js;
* TypeScript;
* Tailwind CSS;
* PostgreSQL;
* Prisma;
* autenticação com JWT/cookies;
* deploy futuro na Vercel;
* banco futuro no Neon.

## Regras gerais de desenvolvimento

Siga estas regras durante o desenvolvimento:

1. Não implemente tudo de uma vez.
2. Trabalhe por etapas pequenas.
3. Priorize código simples e fácil de entender.
4. Evite abstrações exageradas.
5. Explique brevemente cada alteração feita.
6. Não crie funcionalidades fora do escopo sem necessidade.
7. Não adicione bibliotecas desnecessárias.
8. Mantenha o projeto organizado.
9. Prefira nomes de variáveis claros.
10. Priorize legibilidade em vez de complexidade.

## Estilo do código

O código deve ser:

* limpo;
* organizado;
* legível;
* fácil de manter;
* adequado para portfólio;
* comentado apenas quando necessário.

Evitar comentários óbvios.

Exemplo ruim:

```ts
// cria uma variável chamada nome
const nome = "Caio";
```

Exemplo aceitável:

```ts
// Normaliza o termo pesquisado para evitar diferença entre maiúsculas e minúsculas
const termoNormalizado = termo.trim().toLowerCase();
```

## Estrutura inicial sugerida

A estrutura poderá seguir este padrão:

```txt
src/
  app/
    page.tsx
    login/
      page.tsx
    cadastro/
      page.tsx
    dashboard/
      page.tsx
    anotacoes/
      page.tsx
      nova/
        page.tsx
      [id]/
        page.tsx
    api/
      auth/
      anotacoes/
  components/
  lib/
  types/
  styles/
prisma/
  schema.prisma
```

Essa estrutura pode ser ajustada conforme o projeto evoluir, mas qualquer mudança estrutural importante deve ser explicada.

## Ordem recomendada de implementação

A implementação deve seguir esta ordem:

### Fase 1 — Base visual

Criar:

* projeto Next.js;
* configuração com TypeScript;
* Tailwind CSS;
* layout base;
* página inicial;
* dashboard estático;
* cards de exemplo;
* busca visual sem funcionalidade real;
* filtros visuais;
* tela de listagem de anotações estática.

Nesta fase, não implementar banco de dados, autenticação ou API real.

### Fase 2 — CRUD local/mockado

Criar:

* estrutura de tipos TypeScript;
* dados mockados;
* listagem de anotações;
* detalhes de anotação;
* formulário de nova anotação;
* formulário de edição;
* exclusão simulada;
* filtros funcionando no front-end;
* busca funcionando no front-end.

Nesta fase, ainda não usar banco de dados.

### Fase 3 — Banco de dados

Adicionar:

* PostgreSQL;
* Prisma;
* schema inicial;
* models principais;
* conexão com banco;
* migrations;
* rotas de API para anotações.

### Fase 4 — Autenticação

Adicionar:

* cadastro;
* login;
* senha com hash;
* sessão com JWT/cookie;
* proteção de rotas;
* vincular anotações ao usuário autenticado.

### Fase 5 — Refinamento

Adicionar:

* favoritos;
* tags;
* categorias;
* busca melhorada;
* filtros combinados;
* mensagens de erro;
* loading states;
* empty states;
* melhoria visual.

### Fase 6 — Funcionalidades futuras

Depois do MVP, avaliar:

* inteligência artificial;
* sugestão automática de tags;
* resumo automático;
* busca semântica;
* revisão espaçada;
* exportação;
* upload de arquivos.

## Funcionalidades do MVP

O MVP deve conter:

* cadastro de usuário;
* login;
* dashboard;
* criar anotação;
* editar anotação;
* excluir anotação;
* listar anotações;
* visualizar detalhes;
* buscar por palavra-chave;
* filtrar por área;
* filtrar por categoria;
* adicionar tags;
* favoritar anotação;
* criar anotação simples;
* criar anotação do tipo comparação;
* criar anotação do tipo snippet.

## Funcionalidades que não devem ser implementadas no início

Não implementar no início:

* IA;
* editor estilo Notion;
* colaboração entre usuários;
* upload de arquivos;
* app mobile;
* comentários;
* sistema de pagamento;
* permissões avançadas;
* gráfico de conexões;
* markdown complexo.

Essas funcionalidades podem ser consideradas futuramente.

## Tipos de anotação

O sistema deve considerar estes tipos de anotação:

### SIMPLE

Anotação simples.

Usada para conceitos rápidos, regras, observações e frases.

### GUIDE

Guia técnico.

Usado para explicações maiores, passo a passo e exemplos práticos.

### COMPARISON

Comparação.

Usada para comparar duas ou mais soluções.

Exemplo:

* fetch vs axios;
* localStorage vs cookies;
* React vs Next.js.

### SNIPPET

Snippet de código.

Usado para salvar código reutilizável.

### ERROR_SOLUTION

Erro e solução.

Usado para registrar erros, causas e soluções.

## Áreas iniciais sugeridas

Criar suporte para áreas como:

* Inglês;
* Programação;
* Banco de Dados;
* Front-end;
* Back-end;
* Geral.

## Categorias iniciais sugeridas

Exemplos de categorias:

* Expressões;
* Regras;
* JavaScript;
* TypeScript;
* React;
* Next.js;
* Node.js;
* SQL;
* APIs;
* Autenticação;
* Erros;
* Snippets.

## Experiência do usuário

A interface deve ser moderna, limpa e agradável.

Priorizar:

* boa leitura;
* cards organizados;
* busca visível;
* filtros fáceis;
* dashboard limpo;
* navegação simples;
* aparência profissional.

O projeto deve parecer um produto real, não apenas um CRUD básico.

## Restrições importantes

Antes de criar ou modificar arquivos:

1. Leia este arquivo.
2. Entenda a fase atual do projeto.
3. Não avance para fases futuras sem solicitação.
4. Não implemente banco de dados antes da fase correta.
5. Não implemente autenticação antes da fase correta.
6. Não adicione IA sem solicitação.
7. Não reestruture o projeto inteiro sem explicar o motivo.

## Forma de resposta esperada

Ao concluir uma tarefa, explique:

* o que foi feito;
* quais arquivos foram criados ou alterados;
* como rodar ou testar;
* qual o próximo passo recomendado.

## Objetivo final

O objetivo final é construir uma aplicação full stack funcional, bem organizada e apresentável no portfólio.

O StudyBase deve mostrar domínio de:

* Next.js;
* TypeScript;
* Tailwind CSS;
* modelagem de dados;
* CRUD;
* autenticação;
* busca;
* filtros;
* organização de componentes;
* experiência de usuário;
* deploy.
