Última subfase concluída: Fase 4B — Login, logout e sessão
Fase atual: Fase 4 em andamento; aguardando diagnóstico, planejamento e aprovação da próxima subfase
Push: pendente; implementação e documentação da Fase 4B concluídas localmente

Banco local: studybase_dev
Migration: aplicada
Seed: executado
Prisma Studio: validado
Build: passou na validação final da Fase 4B

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
- Commit de implementação da Fase 4A: `99e1ebd feat: prepara credencial da conta inicial`.
- Commit de implementação da Fase 4B: `56158fb feat: implementa login logout e sessao`.

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

Próximo passo recomendado:
- Diagnosticar, planejar e aprovar a próxima subfase da Fase 4 antes de qualquer nova implementação.

Estado atual da Fase 4:
- A Fase 4 foi iniciada; as Fases 4A e 4B estão concluídas.
- Login, logout e sessão estão implementados e validados.
- As rotas ainda não estão protegidas.
- As consultas ainda não são filtradas por usuário.
- Os dados ainda não estão isolados por usuário.
- Não há middleware de autenticação.
- Não há cadastro nem recuperação ou troca de senha.
- Não há rate limiting, sessão persistida no banco ou revogação individual das sessões stateless.
- Não há CRUD real nem persistência real de favoritos.
- A próxima subfase deve ser diagnosticada, planejada e aprovada antes de qualquer nova implementação.

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
