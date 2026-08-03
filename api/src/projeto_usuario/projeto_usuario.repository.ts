import { ProjetoUsuario } from './entities/projeto_usuario.entity';
import { Papel } from './enums/papel.enum';

export interface ProjetoUsuarioRepository {
  listarPorProjeto(projetoId: number): Promise<ProjetoUsuario[]>;
  buscarVinculo(projetoId: number, usuarioId: number): Promise<ProjetoUsuario | null>;
  vincular(projetoId: number, usuarioId: number, papel: Papel): Promise<ProjetoUsuario>;
  salvar(vinculo: ProjetoUsuario): Promise<ProjetoUsuario>;
  desvincular(projetoId: number, usuarioId: number): Promise<boolean>;
  desatribuirAtividadesDoProjeto(projetoId: number, usuarioId: number): Promise<void>;
  projetoExiste(projetoId: number): Promise<boolean>;
  usuarioExiste(usuarioId: number): Promise<boolean>;
}

export const PROJETO_USUARIO_REPOSITORY = Symbol('ProjetoUsuarioRepository');
