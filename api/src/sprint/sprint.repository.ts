import { Sprint } from './entities/sprint.entity';

export interface CriarSprint {
  projetoId: number;
  nome: string;
  dataInicio: Date;
  dataFim: Date;
  status?: Sprint['status'];
}

export interface SprintRepository {
  listarPorProjeto(projetoId: number): Promise<Sprint[]>;
  buscarNoProjeto(projetoId: number, id: number): Promise<Sprint | null>;
  criar(dados: CriarSprint): Promise<Sprint>;
  salvar(sprint: Sprint): Promise<Sprint>;
  remover(projetoId: number, id: number): Promise<boolean>;
  projetoExiste(projetoId: number): Promise<boolean>;
}

export const SPRINT_REPOSITORY = Symbol('SprintRepository');
