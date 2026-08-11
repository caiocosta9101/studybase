Última subfase concluída: Fase 4D — Cadastro de usuário
Fase atual: Fase 4 concluída; Fase 5 pendente de avaliação e planejamento
Push: Fase 4C sincronizada com `origin/main`; Fase 4D ainda sem commit e sem push

Banco local: studybase_dev
Migration: aplicada
Seed: executado
Prisma Studio: validado
Build: passou na validação final da Fase 4D

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
- Fase 4D: cadastro público implementado com validação server-side e senha protegida por hash.
- Fase 4D: autenticação automática após cadastro e fallback seguro para o login.
- Fase 4D: conta nova validada com zero dados e isolada da conta inicial.
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

Entregas concluídas da Fase 4D:
- `/cadastro` está disponível publicamente como Server Page, sem sidebar.
- O formulário envia nome, e-mail, senha e confirmação para uma Server Action.
- Nome e e-mail são normalizados; a senha é preservada sem `trim`.
- As validações decisivas são executadas no servidor.
- O cadastro reutiliza `hashPassword` e o `scrypt` existente antes de criar o usuário.
- A duplicidade é reconhecida somente pelo erro Prisma `P2002` e recebe mensagem genérica.
- O usuário é criado já com `passwordHash`; senha, confirmação e hash não são expostos em URL, logs ou mensagens da interface.
- A sessão stateless existente é criada automaticamente após o cadastro, com redirecionamento para `/dashboard`.
- Se a conta for criada e a sessão falhar, a conta é preservada e o usuário segue para `/login?status=account_created`.
- Usuário autenticado em `/cadastro` é redirecionado no servidor para `/dashboard`.
- A página de login manteve seu fluxo de autenticação e recebeu somente o link de cadastro e a mensagem de conta criada.
- Uma conta sintética foi validada com zero dados, sem acesso aos dados da conta inicial; logout e login posterior também passaram.
- A conta sintética permaneceu no banco local após os testes, sem registro documental de sua senha.
- `npm.cmd run type-check`, `npm.cmd run build` e `git diff --check` passaram.
- Testes manuais/runtime e revisão estática final foram concluídos sem necessidade de correções.
- Não houve alteração de schema, migration, dependência, seed ou variável de ambiente.

Próximo passo recomendado:
- Revisar a documentação da Fase 4D antes de autorizar commit e push. Depois do fechamento da fase, avaliar e planejar a Fase 5 antes de qualquer implementação adicional.

Estado atual da Fase 4:
- A Fase 4 está concluída; as Fases 4A, 4B, 4C e 4D estão implementadas e validadas.
- Login, logout, senha com hash e sessão estão implementados e validados.
- As rotas internas aprovadas estão protegidas no servidor.
- As consultas reais de leitura estão isoladas por usuário.
- Não há middleware legado nem `proxy.ts`; a proteção ocorre nas Server Pages e na camada de dados.
- O cadastro público está implementado, com autenticação automática e validação de uma conta nova com zero dados.
- Todos os objetivos explicitamente definidos pelo roadmap para a Fase 4 estão concluídos.
- Recuperação ou troca de senha, rate limiting, sessão persistida no banco e revogação individual das sessões stateless não estão implementados, mas não são requisitos definidos pelo roadmap para concluir a Fase 4.
- Não há CRUD real nem persistência real de favoritos.
- A Fase 4D ainda não possui commit nem push; a documentação aguarda revisão.

Riscos e pendências conhecidos:
- `prisma/seed.ts` define `passwordHash: null` também no bloco `update` do usuário inicial.
- Executar o seed depois da ativação pode apagar a credencial da conta inicial; o seed não deve ser executado até uma correção separada ser aprovada.
- Recuperação ou troca de senha, verificação de e-mail, OAuth, roles, rate limiting, sessão persistida no banco e revogação individual de sessões permanecem adiados.
- A conta sintética da validação da Fase 4D permanece no banco local por decisão desta etapa.
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
