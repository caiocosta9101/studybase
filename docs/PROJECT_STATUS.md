Última subfase concluída: Fase 4A — Ativação segura da conta inicial
Fase atual: Fase 4 em andamento; aguardando diagnóstico, planejamento e aprovação da Fase 4B
Push: pendente; commit de implementação local e documentação ainda não commitada

Banco local: studybase_dev
Migration: aplicada
Seed: executado
Prisma Studio: validado
Build: passou via Git Bash

Últimos marcos:
- Fase 3B: PostgreSQL local, migration e seed concluídos.
- Fase 3C: planejamento da integração real e diagnóstico dos mocks concluídos.
- Fase 3D: rota `/` integrada com dados reais usando Prisma.
- Fase 3D: listagem real implementada em `/anotacoes`.
- Fase 3D: detalhes reais em `/anotacoes/[id]` concluídos.
- Fase 3D: dashboard integrado com dados reais usando Prisma.
- Fase 3D: `/favoritos` integrada com dados reais usando Prisma.
- Fase 3D: `/areas` integrada com dados reais usando Prisma.
- Fase 3D: `/tags` integrada com dados reais usando Prisma.
- Fase 4A: conta inicial existente ativada com senha protegida por hash.
- Fase 4A: notas existentes preservadas e vinculadas ao mesmo usuário.
- Commit de implementação: `99e1ebd feat: prepara credencial da conta inicial`.

Entregas concluídas da Fase 3D:
- `/` busca métricas e notas recentes reais do PostgreSQL usando Prisma.
- `/anotacoes` busca notas reais do PostgreSQL usando Prisma.
- `/anotacoes/[id]` busca detalhes reais por `slug`.
- `/dashboard` busca métricas, favoritos recentes, áreas e distribuição por tipo diretamente do PostgreSQL.
- `/favoritos` busca notas favoritas reais diretamente do PostgreSQL.
- A remoção de favoritos em `/favoritos` continua somente visual e local, sem escrita no banco.
- `/areas` busca áreas reais com nome, descrição e quantidade de notas.
- Os links de área abrem `/anotacoes?area=<slug>` com o filtro inicial aplicado.
- A resolução do slug acontece no servidor; os demais filtros continuam locais.
- `/tags` busca tags reais com nome e quantidade de notas associadas.
- Os links de tags abrem `/anotacoes?tag=<slug>` com o filtro inicial aplicado.
- Área e tag podem ser usadas simultaneamente como filtros iniciais.
- Prisma permanece exclusivamente no servidor.
- As consultas de leitura estão centralizadas em `src/lib/notes/queries.ts`.
- Não houve escrita no banco durante a Fase 3D.
- Busca, filtros e demais interações visuais continuam locais e sem escrita no banco.
- Favoritos continuam apenas visuais e locais, sem persistência.
- `/anotacoes/nova` continua com criação simulada e local usando os mocks preservados.
- Build passou via Git Bash.
- Testes visuais passaram.

Próximo passo recomendado:
- Diagnosticar, planejar e aprovar a Fase 4B antes de qualquer nova implementação.

Estado atual da Fase 4:
- A Fase 4 foi iniciada; a Fase 4A está concluída.
- Login, logout e sessão ainda não foram implementados.
- As rotas ainda não estão protegidas.
- As consultas ainda não são filtradas por usuário.
- Não há CRUD real nem persistência real de favoritos.
- A Fase 4B deve ser diagnosticada, planejada e aprovada antes de qualquer nova implementação.

Fora do escopo da Fase 4A:
- CRUD real.
- Persistência real de favoritos.
- IA.
- API pública.
