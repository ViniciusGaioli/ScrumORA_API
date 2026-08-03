import { AtividadeResponsavel } from './entities/atividade-responsavel.entity';

export interface AtividadeResponsavelRepository {
  atividadeExiste(atividadeId: number): Promise<boolean>;
  idsDeUsuariosExistentes(usuarioIds: number[]): Promise<number[]>;
  idsDeEquipesExistentes(equipeIds: number[]): Promise<number[]>;
  listarPorAtividade(atividadeId: number): Promise<AtividadeResponsavel[]>;
  buscar(id: number): Promise<AtividadeResponsavel | null>;
  vincular(atividadeId: number, usuarioIds: number[], equipeIds: number[]): Promise<AtividadeResponsavel[]>;
  remover(id: number): Promise<boolean>;
}

export const ATIVIDADE_RESPONSAVEL_REPOSITORY = Symbol('AtividadeResponsavelRepository');
