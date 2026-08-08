Última subfase concluída: Fase 4C — Proteção de acesso e leituras isoladas por usuário
Fase atual: Fase 4 em andamento; próxima subfase ainda não definida
Push: pendente; implementação e documentação da Fase 4C concluídas localmente

Banco local: studybase_dev
Migration: aplicada
Seed: executado
Prisma Studio: validado
Build: passou na validação final da Fase 4C

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
- Fase 4B: login, logout e sessão stateless em cookie assinado implementados.
- Fase 4B: página `/login` separada visualmente do shell principal.
- Fase 4B: sidebar ajustada para manter o logout acessível e rolar somente a navegação quando necessário.
- Fase 4C: rotas internas protegidas no servidor com a sessão existente.
- Fase 4C: leituras reais isoladas pelo `userId` autenticado.
- Fase 4C: nota inexistente ou fora do ownership retorna `404` sem revelar sua existência.
- Commit de implementação da Fase 4A: `99e1ebd feat: prepara credencial da conta inicial`.
- Commit de implementação da Fase 4B: `56158fb feat: implementa login logout e sessao`.
- Commit de implementação da Fase 4C: `9bc1a37 feat: protege rotas e isola leituras por usuario`.

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

Entregas concluídas da Fase 4B:
- `/login` implementada sem sidebar, com formulário ligado a Server Action.
- Credenciais validadas no servidor com mensagem genérica para falhas esperadas.
- Senhas verificadas com o módulo `scrypt` existente.
- Sessão stateless armazenada no cookie assinado `studybase_session`.
- Payload versionado com `v`, `sub`, `iat` e `exp`, assinado com HMAC-SHA-256.
- Cookie configurado com duração de sete dias, `HttpOnly`, `SameSite=Lax`, `Path=/` e `Secure` em produção.
- `SESSION_SECRET` obrigatório, sem fallback, documentado em `.env.example` sem valor real.
- Leitura e validação da sessão realizadas somente no servidor.
- `getCurrentUser` consulta o Prisma somente após validar a sessão e não retorna `passwordHash`.
- Login válido redireciona para `/dashboard`; sessão válida em `/login` também redireciona para `/dashboard`.
- Logout ocorre por formulário POST com Server Action, invalida o cookie e redireciona para `/login`.
- AppShell remove sidebar e margem lateral somente em `/login`.
- A sidebar mantém logo, card inferior e logout visíveis; somente a navegação rola quando necessário.
- `npm run type-check`, `npm run build` e `git diff --check` passaram.
- Os sete arquivos da fase foram revisados, incluindo a separação entre código server-side e Client Components.
- Testes manuais de login, persistência, redirecionamentos, logout, atributos do cookie e rejeição de cookies inválidos passaram.

Entregas concluídas da Fase 4C:
- `requireCurrentUser` reutiliza a sessão existente e redireciona visitantes para `/login`.
- `/`, `/dashboard`, `/anotacoes`, `/anotacoes/[id]`, `/favoritos`, `/areas`, `/tags`, `/anotacoes/nova` e `/configuracoes` exigem usuário autenticado no servidor.
- `/login` permanece pública e redireciona uma sessão válida para `/dashboard`.
- As nove funções reais de leitura em `src/lib/notes/queries.ts` exigem `userId` explicitamente.
- Notas, favoritos, métricas, contagens, agregações e distribuição por tipo são filtrados pelo usuário autenticado.
- Áreas, categorias e tags permanecem globais no schema, mas são exibidas e contadas somente pelas relações com notas do usuário.
- Notas com `userId = null` ficam fora das leituras privadas.
- `getNoteBySlug` combina `slug` e `userId`; nota inexistente e nota de outro usuário seguem o mesmo caminho de `404`.
- `/anotacoes/nova` foi reorganizada em Server Page protegida e `new-note-form.tsx` como Client Component, mantendo criação e validações mockadas.
- Prisma permanece exclusivamente no servidor e `src/lib/notes/queries.ts` está marcado como `server-only`.
- Não houve alteração de schema, migration, seed, dependência ou variável de ambiente; nenhum `proxy.ts` foi criado.
- `npm.cmd run type-check`, `npm.cmd run build` e `git diff --check` passaram.
- A revisão de segurança confirmou os filtros de ownership em queries, contagens, `_count` e `groupBy`.
- Testes runtime confirmaram acesso autenticado às rotas internas, logout, redirecionamento de visitantes, redirecionamento de `/login` autenticada, `404` para slug inexistente e funcionamento de `/anotacoes/nova`.
- Nenhum erro de console relacionado à Fase 4C foi encontrado.
- O isolamento horizontal entre dois usuários reais não foi testado em runtime, pois exigiria criar um segundo usuário e dados adicionais; essa ressalva não representa falha da subfase.

Próximo passo recomendado:
- Diagnosticar, planejar e aprovar a próxima subfase da Fase 4 antes de qualquer nova implementação; ela ainda não está formalmente definida.

Estado atual da Fase 4:
- A Fase 4 continua em andamento; as Fases 4A, 4B e 4C estão concluídas.
- Login, logout, senha com hash e sessão estão implementados e validados.
- As rotas internas aprovadas estão protegidas no servidor.
- As consultas reais de leitura estão isoladas por usuário.
- Não há middleware legado nem `proxy.ts`; a proteção ocorre nas Server Pages e na camada de dados.
- Cadastro continua pendente e é o único objetivo explicitamente definido pelo roadmap ainda não concluído na Fase 4.
- Recuperação ou troca de senha, rate limiting, sessão persistida no banco e revogação individual das sessões stateless não estão implementados, mas não são requisitos definidos pelo roadmap para concluir a Fase 4.
- Não há CRUD real nem persistência real de favoritos.
- A próxima subfase ainda não possui nome ou escopo formalmente aprovados e deve ser diagnosticada, planejada e aprovada antes de qualquer nova implementação.

Riscos e pendências conhecidos:
- `prisma/seed.ts` define `passwordHash: null` também no bloco `update` do usuário inicial.
- Executar o seed depois da ativação pode apagar a credencial da conta inicial; o seed não deve ser executado até uma correção separada ser aprovada.
- O rodapé dos cards de "Anotações favoritas" pode comprimir área e data em determinadas larguras.
- O problema dos cards é anterior à Fase 4B; `dashboard` e `note-card` não foram alterados e a correção deve ser tratada separadamente.

Fora do escopo da Fase 4B:
- Proteção de rotas e middleware.
- Isolamento das consultas por usuário.
- Cadastro e recuperação ou troca de senha.
- CRUD real.
- Persistência real de favoritos.
- IA.
- API pública.
