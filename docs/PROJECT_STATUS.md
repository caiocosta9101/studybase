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

Entregas da Fase 3D até agora:
- `/anotacoes` busca notas reais do PostgreSQL usando Prisma.
- `/anotacoes/[id]` busca detalhes reais por `slug`.
- `/dashboard` busca métricas, favoritos recentes, áreas e distribuição por tipo diretamente do PostgreSQL.
- Prisma está isolado no servidor.
- Busca, filtros e favorito visual continuam sem escrita no banco.
- Mocks continuam apenas nas telas ainda não integradas.
- Build passou via Git Bash.
- Testes visuais passaram.

Próximo passo recomendado:
- Diagnosticar qual próxima tela deve receber dados reais: `/favoritos`, `/areas` ou `/tags`.

Fora do escopo atual:
- CRUD real.
- Autenticação.
- IA.
- API pública.
- Escrita real de favoritos.