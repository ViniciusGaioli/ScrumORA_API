import { Projeto } from './entities/projeto.entity';
import { ProjetoUsuario } from '../projeto_usuario/entities/projeto_usuario.entity';

export interface ProjetoRepository {
  buscar(id: number): Promise<Projeto | null>;
  criarComScrumMaster(criadorId: number, dados: { nome: string; descricao: string }): Promise<Projeto>;
  listarVinculosDoUsuario(usuarioId: number): Promise<ProjetoUsuario[]>;
  salvar(projeto: Projeto): Promise<Projeto>;
  remover(id: number): Promise<boolean>;
  usuarioExiste(usuarioId: number): Promise<boolean>;
}

export const PROJETO_REPOSITORY = Symbol('ProjetoRepository');
