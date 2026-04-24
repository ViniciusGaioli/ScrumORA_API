# ScrumORA API Documentation

Base URL: `http://localhost:3000`

All routes except **login** and **user creation** require a JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

---

## Roles

Routes inside a project are protected by a role guard based on the requesting user's membership (`projeto_usuario`).

| Role | Value |
|---|---|
| Product Owner | `product_owner` |
| Scrum Master | `scrum_master` |
| Developer | `developer` |

---

## Auth

### `POST /auth/login`
Authenticate and receive a JWT token. **Public.**

**Body:**
```json
{ "email": "user@example.com", "senha": "password123" }
```

**Response `200`:**
```json
{
  "accessToken": "<jwt>",
  "user": { "id": 1, "nome": "...", "email": "..." }
}
```

---

## Users

### `POST /users` — Create user. **Public.**
**Body:** `nome`, `email`, `senha` (min 8 chars), `fotoPerfil` (URL, optional)

### `GET /users` — List all users.

### `GET /users/:id` — Get user by ID.

### `PATCH /users/:id` — Update user fields.

### `DELETE /users/:id` — Delete user. `204`

---

## Projetos

Creating a project automatically adds the requesting user as `product_owner`.

### `POST /projetos` — Create project.
**Body:** `nome`, `descricao`

### `GET /projetos` — List all projects.

### `GET /projetos/:id` — Get project by ID.

### `PATCH /projetos/:id` — Update project. **Role: PO or SM**
**Body:** `nome`, `descricao` (both optional)

### `DELETE /projetos/:id` — Delete project. **Role: PO or SM** `204`

---

## Membros (project membership)

Base: `/projetos/:projetoId/membros`

### `POST /projetos/:projetoId/membros` — Add a user to the project. **Role: PO or SM**
**Body:** `usuarioId`, `papel` (`product_owner` | `scrum_master` | `developer`)

### `GET /projetos/:projetoId/membros` — List project members. **Role: any member**

### `GET /projetos/:projetoId/membros/:usuarioId` — Get a single member. **Role: any member**

### `PATCH /projetos/:projetoId/membros/:usuarioId` — Update member role. **Role: PO or SM**
**Body:** `papel`

### `DELETE /projetos/:projetoId/membros/:usuarioId` — Remove member. **Role: PO or SM** `204`

---

## Equipes

Base: `/projetos/:projetoId/equipes`

### `POST /projetos/:projetoId/equipes` — Create team. **Role: PO or SM**
**Body:** `nome`

### `GET /projetos/:projetoId/equipes` — List teams. **Role: any member**

### `GET /projetos/:projetoId/equipes/:id` — Get team. **Role: any member**

### `PATCH /projetos/:projetoId/equipes/:id` — Update team name. **Role: PO or SM**

### `DELETE /projetos/:projetoId/equipes/:id` — Delete team. **Role: PO or SM** `204`

### `GET /projetos/:projetoId/equipes/:id/membros` — List team members.

### `POST /projetos/:projetoId/equipes/:id/membros/:usuarioId` — Add user to team. **Role: PO or SM**

### `DELETE /projetos/:projetoId/equipes/:id/membros/:usuarioId` — Remove user from team. **Role: PO or SM** `204`

---

## Sprints

Base: `/projetos/:projetoId/sprints`

Status values: `planejada` | `em_andamento` | `concluida` | `cancelada`

### `POST /projetos/:projetoId/sprints` — Create sprint. **Role: PO or SM**
**Body:** `nome`, `dataInicio` (ISO date), `dataFim` (ISO date), `status` (optional, default `planejada`)

### `GET /projetos/:projetoId/sprints` — List sprints. **Role: any member**

### `GET /projetos/:projetoId/sprints/:id` — Get sprint by ID.

### `PATCH /projetos/:projetoId/sprints/:id` — Update sprint. **Role: PO or SM**

### `DELETE /projetos/:projetoId/sprints/:id` — Delete sprint. **Role: PO or SM** `204`

---

## Atividades

Base: `/projetos/:projetoId/atividades`

Etapa values: `backlog` | `desenvolvimento` | `impedimento` | `aprovacao` | `finalizada`

### `POST /projetos/:projetoId/atividades` — Create activity. **Role: PO or SM**
**Body:** `nome`, `descricao`, `dataInicio` (ISO date), `dataFim` (ISO date), `etapa` (optional), `sprintId` (optional), `arquivada` (optional, default `false`)

### `GET /projetos/:projetoId/atividades` — List activities for the project. **Role: any member**

### `GET /projetos/:projetoId/atividades/:id` — Get activity by ID. **Role: any member**

### `PATCH /projetos/:projetoId/atividades/:id` — Update activity. **Role: PO or SM**

### `PATCH /projetos/:projetoId/atividades/:id/arquivar` — Archive activity. **Role: PO or SM**

### `PATCH /projetos/:projetoId/atividades/:id/desarquivar` — Unarchive activity. **Role: PO or SM**

### `DELETE /projetos/:projetoId/atividades/:id` — Delete activity. **Role: PO or SM** `204`

---

## Atividade Responsável

Assigns users or teams as responsible for an activity.

### `POST /atividade-responsavel` — Assign responsibles.
**Body:** `atividadeId`, `usuarioIds` (number[], optional), `equipeIds` (number[], optional)
At least one of `usuarioIds` or `equipeIds` must be provided.

### `GET /atividade-responsavel` — List all. Optional query filters:
- `?atividadeId=` — by activity
- `?usuarioId=` — by user
- `?equipeId=` — by team

### `GET /atividade-responsavel/:id` — Get by ID.

### `DELETE /atividade-responsavel/:id` — Remove responsible assignment. `204`
