# ScrumORA — API

API REST do ScrumORA, ferramenta de gestão de projetos ágeis desenvolvida como Trabalho
de Conclusão de Curso.

> **A interface web fica em [ScrumORA (frontend)](https://github.com/ViniciusGaioli/ScrumORA).**
> É lá que está a aplicação que consome esta API.

---

## O que a API expõe

**47 rotas** distribuídas em 9 módulos de domínio, mais a rota raiz do scaffold do Nest.

| Módulo | Prefixo | Rotas |
|---|---|---|
| Autenticação | `/auth` | 6 |
| Usuários | `/users` | 5 |
| Projetos | `/projetos` | 5 |
| Integrantes | `/projetos/:projetoId/membros` | 5 |
| Equipes | `/projetos/:projetoId/equipes` | 8 |
| Sprints | `/projetos/:projetoId/sprints` | 5 |
| Atividades | `/projetos/:projetoId/atividades` | 7 |
| Responsáveis por atividade | `/atividade-responsavel` | 4 |
| Convites | `/projetos/:projetoId/convites`, `/convites/:token/aceitar` | 2 |

O aninhamento das rotas não é decorativo: `projetoId` é o que o guard de autorização usa
para resolver o papel do usuário naquele projeto, e o que os repositórios usam para
garantir que um recurso pertence mesmo ao projeto da URL.

---


## Tecnologias

| | |
|---|---|
| Framework | NestJS 11 |
| Linguagem | TypeScript 5.7 |
| Banco | MariaDB 11.4 |
| ORM | TypeORM 0.3 com migrations |
| Validação | class-validator + ValidationPipe global |
| Autenticação | Passport (JWT + Google OAuth 2.0) |
| E-mail | Nodemailer |
| Runtime | Node 20 (Docker) |

---

## Rodando localmente

Requer Docker e Docker Compose.

```bash
cp .env.example .env    # preencha as variáveis
docker compose up -d
```

A API sobe em `http://localhost:3000` e o MariaDB na porta definida por
`DB_EXTERNAL_PORT`.

> **Atenção ao `JWT_VERIFY_SECRET`.** Ele assina os links de confirmação de e-mail e
> precisa ser **diferente** do `JWT_SECRET`. Com a mesma chave, um link de confirmação
> passa a valer como token de sessão. A aplicação falha com mensagem explícita se a
> variável estiver ausente, em vez de degradar em silêncio.

O código da aplicação fica em `api/` — é lá que está o `package.json`, e é de lá que os
scripts npm rodam. O `docker-compose.yml` fica na raiz.

### Migrations

O schema é versionado. `synchronize` está desligado — o banco não é mais alterado em
runtime a partir das entidades.

Rodando de dentro de `api/`:

| Comando | O que faz |
|---|---|
| `npm run migration:generate -- src/migrations/Nome` | Gera a partir do diff entre entidades e banco |
| `npm run migration:run` | Aplica as pendentes |
| `npm run migration:revert` | Desfaz a última |

As migrations rodam automaticamente na subida da aplicação (`migrationsRun: true`), então
o fluxo normal de desenvolvimento não exige rodar nada à mão.

---

## Documentação

`docs/DocumentaçãoAPI.pdf` traz o detalhamento das rotas com exemplos de requisição e
resposta.
