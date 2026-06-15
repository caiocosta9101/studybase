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
- Fase 3D: primeira leitura real implementada em `/anotacoes`.

Entregas da Fase 3D até agora:
- `/anotacoes` passou a buscar notas reais do PostgreSQL usando Prisma.
- Prisma ficou isolado no servidor em `src/lib/`.
- A listagem recebeu os dados reais já mapeados para a UI.
- Busca, filtros, contagem, empty state e favorito visual continuam no client.
- Favoritos continuam simulados, sem escrita no banco.
- As demais telas continuam usando mocks por enquanto.
- Build passou via Git Bash.
- Testes visuais da listagem foram validados.

Próximo passo recomendado:
- Diagnosticar a tela `/anotacoes/[id]` antes de implementar leitura real nos detalhes.

Fora do escopo atual:
- CRUD real.
- Autenticação.
- IA.
- API pública.
- Escrita real de favoritos.