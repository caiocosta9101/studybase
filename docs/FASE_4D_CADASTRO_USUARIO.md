# Fase 4D — Cadastro de usuário

Status: concluída.

## Objetivo

Implementar cadastro público de usuário de forma simples, segura e compatível com o login, o hash de senha, a sessão stateless e o isolamento de dados já existentes.

---

## Contexto anterior

As Fases 4A, 4B e 4C já haviam estabelecido a credencial segura da conta inicial, o fluxo de login e logout, a sessão em cookie assinado, a proteção server-side das rotas internas e o isolamento das leituras por usuário. Cadastro era o único objetivo explicitamente pendente da Fase 4 no roadmap.

---

## Escopo implementado

Foram implementados:

* página pública `/cadastro`, renderizada no servidor;
* formulário com nome, e-mail, senha e confirmação de senha;
* cadastro por Server Action;
* criação do usuário já com `passwordHash`;
* autenticação automática após a criação da conta;
* redirecionamento para `/dashboard` após cadastro e sessão bem-sucedidos;
* fallback para `/login` quando a conta é criada, mas a sessão não pode ser iniciada;
* link entre as páginas de login e cadastro;
* tratamento de `/login` e `/cadastro` como telas públicas sem sidebar no `AppShell`.

---

## Arquivos envolvidos

Foram criados:

* `src/app/cadastro/actions.ts`;
* `src/app/cadastro/page.tsx`.

Foram alterados:

* `src/app/login/page.tsx`;
* `src/components/app-shell.tsx`.

---

## Fluxo do cadastro

1. A página `/cadastro` verifica no servidor se já existe um usuário autenticado.
2. Visitantes recebem o formulário de cadastro.
3. A Server Action lê e valida os quatro campos recebidos.
4. O nome é normalizado, e o e-mail é normalizado para minúsculas.
5. A senha é preservada exatamente como foi digitada e transformada em hash pelo módulo de senha existente.
6. O Prisma cria o usuário selecionando como retorno somente seu `id`.
7. A sessão existente é criada para o novo usuário.
8. O usuário é redirecionado para `/dashboard`.

Nenhum dado privado da conta inicial é associado ao novo usuário. As leituras protegidas continuam filtradas pelo `userId` autenticado.

---

## Validações

As validações decisivas são executadas no servidor, independentemente das restrições declaradas no formulário:

* todos os campos esperados devem existir como strings;
* o nome é submetido a `trim`, deve ser preenchido e ter no máximo 100 caracteres;
* o e-mail é submetido a `trim`, convertido para minúsculas, limitado a 254 caracteres e validado quanto ao formato básico;
* a senha deve ter entre 12 e 128 caracteres;
* a senha não recebe `trim`, preservando espaços intencionais;
* a confirmação deve ser exatamente igual à senha;
* entradas inválidas recebem mensagens controladas, sem devolver os valores informados.

As restrições HTML do formulário melhoram a experiência, mas não substituem a validação server-side.

---

## Tratamento da senha

O cadastro reutiliza `hashPassword` de `src/lib/auth/password.ts`, mantendo o algoritmo `scrypt` e o formato versionado aprovados na Fase 4A. Não foi criada uma segunda implementação de hash e nenhuma dependência foi adicionada.

A senha em texto puro e sua confirmação são usadas somente durante o processamento da Server Action. Elas não são colocadas em URL, logs ou mensagens da interface. Somente `passwordHash` é persistido no campo correspondente do usuário, e esse hash não é retornado à interface.

Se a geração do hash falhar, nenhum usuário é criado e o fluxo apresenta uma mensagem genérica de indisponibilidade.

---

## Duplicidade e tratamento de `P2002`

A unicidade do e-mail continua garantida pela restrição existente no schema Prisma. Uma violação conhecida é identificada somente quando o erro é uma instância de `Prisma.PrismaClientKnownRequestError` com código `P2002`.

Somente `P2002` recebe o tratamento de conflito. Ele produz uma mensagem genérica de falha no cadastro, sem confirmar explicitamente que o e-mail já está registrado. Outros erros de criação recebem a mensagem genérica de indisponibilidade.

Essa separação evita classificar falhas inesperadas como duplicidade e reduz a exposição direta da existência de contas.

---

## Sessão automática e fallback

Depois que o usuário é criado, `createSession` reutiliza a sessão stateless em cookie assinado implementada na Fase 4B. Se a sessão for criada, o fluxo redireciona para `/dashboard`.

Se `User.create` terminar com sucesso, mas `createSession` falhar, a conta válida é preservada e o usuário é redirecionado para:

```txt
/login?status=account_created
```

A página de login informa que a conta foi criada e solicita autenticação. Esse fallback evita declarar falha total depois de a conta já ter sido persistida e permite que o usuário entre normalmente com suas credenciais.

---

## Usuário autenticado em `/cadastro`

`/cadastro` consulta `getCurrentUser` no servidor antes de renderizar o formulário. Uma sessão válida provoca redirecionamento server-side para `/dashboard`.

A página de cadastro permanece como Server Component. A lógica sensível fica na Server Action e não foi movida para Client Component.

---

## Validação da conta nova e isolamento

Uma conta sintética foi criada durante os testes locais e validada com zero dados próprios. Dashboard, listagens e demais leituras protegidas não exibiram os dados pertencentes à conta inicial.

Também foram validados o logout da conta nova e um login posterior com as mesmas credenciais. A conta sintética permaneceu no banco local após a validação, conforme decisão desta etapa. Sua senha não é registrada neste documento nem em outro material da fase.

---

## Verificações executadas

Passaram:

* `npm.cmd run type-check`;
* `npm.cmd run build`;
* `git diff --check`;
* testes manuais e runtime do fluxo completo de cadastro;
* revisão estática final dos arquivos envolvidos.

O type-check terminou sem erros. O build de produção foi concluído com sucesso. `git diff --check` não encontrou erros de whitespace.

Os testes confirmaram:

* criação do usuário já com `passwordHash`;
* normalização do e-mail;
* preservação da senha sem `trim`;
* tratamento de e-mail duplicado;
* autenticação automática e redirecionamento para `/dashboard`;
* logout e login posterior;
* conta nova com zero dados;
* isolamento completo em relação à conta inicial.

---

## Alterações estruturais não realizadas

A Fase 4D não exigiu:

* alteração do schema Prisma;
* migration;
* nova dependência;
* alteração ou execução do seed;
* nova variável de ambiente.

---

## Riscos e funcionalidades conscientemente adiados

Permanecem fora do escopo:

* recuperação e troca de senha;
* verificação de e-mail;
* OAuth ou login social;
* roles e permissões avançadas;
* rate limiting;
* sessão persistida no banco;
* revogação individual de sessões stateless;
* correção do risco conhecido no seed da conta inicial;
* remoção automática da conta sintética usada nos testes;
* CRUD real e persistência real de favoritos.

Esses itens não são objetivos explícitos pendentes da Fase 4 no roadmap e não impedem sua conclusão.

---

## Commits publicados

```txt
6155610 feat: implementa cadastro de usuario
2007f23 docs: registra conclusao da fase 4d
```

---

## Situação posterior

A Fase 4 foi encerrada e publicada com as Fases 4A–4D concluídas. A Fase 5 foi posteriormente diagnosticada, estruturada em 5A–5H e iniciada. A Fase 5A concluiu a criação real de anotações básicas no commit `4761324 feat: implementa criacao real de anotacoes`.
