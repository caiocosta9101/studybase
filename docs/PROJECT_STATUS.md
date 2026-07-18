Última fase concluída: Fase 3C
Fase atual: Fase 3D — Leitura real do banco com Prisma
Push: realizado

Banco local: studybase_dev
Migration: aplicada
Seed: executado
Prisma Studio: validado
Build: passou via Git Bash

Últimos marcos:
- Fase 3B: PostgreSQL local, migration e seed concluídos.
- Fase 3C: planejamento da integração real e diagnóstico dos mocks concluídos.
- Fase 3D: listagem real implementada em `/anotacoes`.
- Fase 3D: detalhes reais em `/anotacoes/[id]` concluídos.
- Fase 3D: dashboard integrado com dados reais usando Prisma.
- Fase 3D: `/favoritos` integrada com dados reais usando Prisma.

Entregas da Fase 3D até agora:
- `/anotacoes` busca notas reais do PostgreSQL usando Prisma.
- `/anotacoes/[id]` busca detalhes reais por `slug`.
- `/dashboard` busca métricas, favoritos recentes, áreas e distribuição por tipo diretamente do PostgreSQL.
- `/favoritos` busca notas favoritas reais diretamente do PostgreSQL.
- A remoção de favoritos em `/favoritos` continua somente visual e local, sem escrita no banco.
- Prisma está isolado no servidor.
- Busca, filtros e demais interações visuais continuam sem escrita no banco.
- Mocks continuam nas telas e funcionalidades ainda não integradas.
- Build passou via Git Bash.
- Testes visuais passaram.

Próximo passo recomendado:
- Diagnosticar qual próxima tela deve receber dados reais: `/areas` ou `/tags`.

Fora do escopo atual:
- CRUD real.
- Autenticação.
- IA.
- API pública.
- Escrita real de favoritos.