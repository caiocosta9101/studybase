# Fase 3C — Planejamento da integração dos dados reais

## Objetivo

Planejar como substituir os dados mockados atuais por dados reais do PostgreSQL usando Prisma.

Esta fase é apenas de diagnóstico e planejamento.
Não deve implementar código da aplicação ainda.

---

## Contexto

A Fase 3B foi concluída.

Já temos:

* PostgreSQL local funcionando;
* banco local `studybase_dev`;
* Prisma configurado;
* schema criado e revisado;
* migration inicial aplicada;
* seed executado com dados fake;
* dados validados no Prisma Studio;
* build aprovado.

A próxima etapa é entender como a interface atual, que ainda usa mocks, pode começar a consumir dados reais do banco.

---

## Escopo permitido

Nesta fase podemos:

* mapear arquivos que usam dados mockados;
* identificar quais telas dependem desses mocks;
* comparar os mocks atuais com o `schema.prisma`;
* verificar se o seed cobre as telas atuais;
* propor uma estratégia simples para leitura real com Prisma;
* documentar riscos antes de implementar.

---

## Fora do escopo

Nesta fase não devemos:

* implementar CRUD real;
* implementar autenticação;
* implementar IA;
* criar rotas de API sem aprovação;
* fazer grandes refatorações;
* substituir todos os mocks de uma vez;
* alterar schema sem necessidade clara;
* alterar seed sem validação prévia.

---

## Perguntas que a Fase 3C deve responder

* Onde estão os dados mockados?
* Quais telas usam esses dados?
* Quais models do Prisma representam esses dados?
* O seed atual tem dados suficientes para alimentar a interface?
* Qual tela deve ser a primeira a usar dados reais?
* A leitura real deve começar por Server Components, funções em `lib/`, repository simples ou outra abordagem?
* Quais riscos existem antes de trocar os mocks?

---

## Plano sugerido

### Etapa 1 — Diagnóstico dos mocks

Mapear todos os arquivos que importam ou usam dados mockados.

### Etapa 2 — Telas dependentes

Identificar quais páginas e componentes dependem desses mocks.

### Etapa 3 — Comparação com o schema

Comparar os campos usados na interface com os models do Prisma.

### Etapa 4 — Verificação do seed

Confirmar se os dados fake criados no seed são suficientes para testar a interface com dados reais.

### Etapa 5 — Estratégia de leitura real

Escolher uma abordagem simples e segura para buscar dados reais com Prisma.

### Etapa 6 — Aprovação antes da implementação

Antes de alterar código da aplicação, revisar o plano e aprovar a próxima etapa.

---

## Checklist de validação

* [ ] Arquivos com mocks mapeados.
* [ ] Telas dependentes dos mocks identificadas.
* [ ] Correspondência com `schema.prisma` documentada.
* [ ] Lacunas do seed identificadas, se existirem.
* [ ] Estratégia de leitura real definida.
* [ ] Nenhuma API criada sem aprovação.
* [ ] Nenhum CRUD real implementado.
* [ ] Nenhuma autenticação implementada.
* [ ] Nenhuma IA implementada.
* [ ] Nenhuma grande refatoração feita sem aprovação.

---

## Resultado esperado da Fase 3C

Ao final da Fase 3C, devemos ter clareza sobre:

* quais mocks existem;
* quais telas serão afetadas;
* quais dados reais já existem no banco;
* qual será o primeiro ponto seguro para integração com Prisma;
* quais ajustes precisam ser feitos antes da Fase 3D.
