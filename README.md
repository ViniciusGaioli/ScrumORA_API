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

## Contrato de resposta

Toda resposta usa o mesmo envelope. Quem consome não precisa saber o formato de cada
rota — só se veio `dados` ou `erro`.

**Sucesso**

```json
{ "mensagem": "Atividade criada.", "dados": { "id": 12, "nome": "..." } }
```

**Erro**

```json
{
  "erro": {
    "codigo": "ACTIVITY.NAO_ENCONTRADA",
    "mensagem": "Atividade não encontrada.",
    "status": 404
  }
}
```

Erros de validação trazem também `campos`, mapeando cada campo inválido à sua mensagem.

O `codigo` é o identificador estável. A `mensagem` é texto para o usuário e pode ser
reescrita sem quebrar o cliente. Todos os códigos vivem num catálogo central por
entidade, em `common/errors/catalogo.ts` — não existe string de erro solta dentro de
service.

---

## Arquitetura

| Padrão | Referência | Onde está aplicado |
|---|---|---|
| **Clean Architecture** | Robert C. Martin | `Controller → Service → Repository (porta) → TypeORM (adaptador)` |
| **Hexagonal (Ports & Adapters)** | Alistair Cockburn | `*.repository.ts` é a interface; `*.typeorm.repository.ts` é a única classe que conhece o ORM |
| **Repository Pattern** | Fowler, *PoEAA* | 7 dos 9 domínios |
| **Modular Monolith** | — | Um módulo NestJS por domínio, com fronteiras explícitas |
| **Result / Envelope** | Railway Oriented Programming | `Resposta \| Erro` em `common/envelope` |

### Anatomia de um domínio

```
sprint/
├── sprint.controller.ts          Borda fina: recebe, valida e delega
├── sprint.service.ts             Regra de negócio; depende da INTERFACE
├── sprint.repository.ts          A porta: interface + token de injeção
├── sprint.typeorm.repository.ts  O adaptador: único que importa TypeORM
├── sprint.module.ts              Liga o token à implementação
├── dto/                          Entrada validada por class-validator
├── entities/                     Mapeamento das tabelas
└── enums/
```

O service recebe a interface por injeção, não o `Repository<T>` do TypeORM:

```ts
constructor(
  @Inject(SPRINT_REPOSITORY)
  private readonly repositorio: SprintRepository,
) {}
```

Duas consequências: o service é testável com um duplo em memória, sem subir banco nem
mockar `getRepositoryToken`; e trocar de ORM significa escrever outra classe que
implementa a mesma interface, sem tocar em regra de negócio.

### Camada transversal

```
common/
├── envelope/      Os tipos Resposta, Erro e Operacao
├── errors/        Catálogo por entidade + a exceção ErroDominio
├── filters/       Filtro global: traduz qualquer exceção para { erro }
├── interceptors/  Interceptor global: embrulha o sucesso em { mensagem, dados }
├── guards/        Autorização por papel no projeto
└── decorators/    @Public, @PapeisRequeridos, @CurrentUser, @Mensagem
```

O controller devolve o dado puro e o interceptor embrulha. A mensagem de sucesso vem
do decorator `@Mensagem` na própria rota.

### Autenticação e autorização

- **JWT Bearer** com validade de 7 dias, via Passport
- **Google OAuth 2.0** para login e cadastro
- **Confirmação de e-mail** com token assinado por chave própria, separada da chave de sessão
- Guard global de autenticação; rotas públicas marcadas com `@Public()`
- Guard de papel por projeto: `@PapeisRequeridos(Papel.SCRUM_MASTER, ...)`. Na ausência
  do decorator, o guard **nega** — a permissão precisa ser declarada, não presumida

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
