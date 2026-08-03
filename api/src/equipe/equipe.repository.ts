import { Equipe } from './entities/equipe.entity';
import { User } from '../users/entities/user.entity';

export interface EquipeRepository {
  listarPorProjeto(projetoId: number): Promise<Equipe[]>;
  buscarNoProjeto(projetoId: number, id: number): Promise<Equipe | null>;
  buscarComUsuarios(projetoId: number, id: number): Promise<Equipe | null>;
  criar(projetoId: number, nome: string): Promise<Equipe>;
  salvar(equipe: Equipe): Promise<Equipe>;
  remover(projetoId: number, id: number): Promise<boolean>;
  projetoExiste(projetoId: number): Promise<boolean>;
  buscarUsuario(usuarioId: number): Promise<User | null>;
}

export const EQUIPE_REPOSITORY = Symbol('EquipeRepository');
