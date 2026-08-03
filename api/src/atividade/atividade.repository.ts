import { Atividade } from './entities/atividade.entity';
import { Sprint } from '../sprint/entities/sprint.entity';

export interface CriarAtividade {
  projetoId: number;
  nome: string;
  descricao: string;
  dataInicio: Date;
  dataFim: Date;
  etapa?: Atividade['etapa'];
  arquivada?: boolean;
  sprintId?: number;
}

export interface AtividadeRepository {
  listarPorProjeto(projetoId: number): Promise<Atividade[]>;
  buscarNoProjeto(projetoId: number, id: number, comSprint?: boolean): Promise<Atividade | null>;
  criar(dados: CriarAtividade): Promise<Atividade>;
  salvar(atividade: Atividade): Promise<Atividade>;
  remover(projetoId: number, id: number): Promise<boolean>;
  projetoExiste(projetoId: number): Promise<boolean>;
  buscarSprintNoProjeto(projetoId: number, sprintId: number): Promise<Sprint | null>;
}

export const ATIVIDADE_REPOSITORY = Symbol('AtividadeRepository');
