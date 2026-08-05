# Fase 4A — Ativação segura da conta inicial

Status: concluída.

## Objetivo

Preparar a conta pessoal inicial já existente no banco para o login futuro, atribuindo uma senha protegida por hash sem criar cadastro público, sessão ou proteção de rotas.

---

## Contexto anterior

A Fase 3D concluiu a leitura real dos dados com Prisma. O banco local já possuía uma conta inicial criada pelo seed e notas vinculadas a ela, mas a conta ainda não tinha uma credencial definida.

---

## Decisões aprovadas

* iniciar o StudyBase com uma conta pessoal inicial;
* preservar a conta e as notas existentes;
* ativar a credencial por script local;
* usar `crypto.scrypt` nativo do Node.js, sem novas dependências;
* manter Prisma exclusivamente no servidor;
* não alterar schema, migration ou seed;
* não criar cadastro público, login, sessão, cookies, JWT ou middleware nesta subfase.

---

## Implementação realizada

Foram adicionados:

* `src/lib/auth/password.ts`, com validação, geração e verificação de hash de senha;
* `scripts/activate-initial-user.ts`, para ativar somente uma conta existente sem credencial;
* o comando npm `auth:activate-initial-user`.

O script valida os dados temporários de ativação, localiza a conta existente e atualiza somente a credencial protegida. A atualização é condicional para recusar uma segunda ativação, inclusive em caso de tentativas concorrentes.

---

## Estratégia de hash

O hash usa `scrypt` com formato versionado e validação estrita.

Parâmetros usados:

* `N=131072`;
* `r=8`;
* `p=1`;
* salt aleatório de 16 bytes por hash;
* digest de 64 bytes.

As operações de geração e verificação são assíncronas. A comparação usa mecanismo seguro contra diferenças de tempo, e hashes malformados são rejeitados sem expor detalhes.

Nenhuma senha em texto puro foi armazenada, registrada ou documentada.

---

## Resultado da ativação

A conta inicial existente foi ativada com uma senha protegida por hash. As notas existentes foram preservadas e continuam vinculadas ao mesmo usuário.

---

## Validações executadas

* testes do módulo de senha, incluindo formato, validação e verificação;
* `npm run type-check`;
* `npm run build`;
* `git diff --check`;
* verificação posterior da ativação da conta e da preservação das notas por consulta somente leitura.

---

## Commit de implementação

```txt
99e1ebd feat: prepara credencial da conta inicial
```

---

## Fora do escopo

* login e logout;
* sessão, cookies e JWT;
* proteção de rotas;
* isolamento das consultas por usuário;
* cadastro público;
* CRUD real;
* persistência real de favoritos;
* API pública e IA.

---

## Próximo passo recomendado

Diagnosticar, planejar e aprovar a Fase 4B antes de iniciar qualquer implementação de login, sessão ou proteção de dados.
