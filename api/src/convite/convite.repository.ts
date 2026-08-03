import { Convite } from './entities/convite.entity';
import { Papel } from '../projeto_usuario/enums/papel.enum';

export interface CriarConvite {
  projetoId: number;
  token: string;
  email: string | null;
  papel: Papel;
  expiresAt: Date;
}

export interface ConviteRepository {
  buscarProjeto(projetoId: number): Promise<{ id: number; nome: string } | null>;
  criar(dados: CriarConvite): Promise<Convite>;
  buscarPorToken(token: string): Promise<Convite | null>;
  marcarComoUsado(convite: Convite): Promise<void>;
  participaDoProjeto(usuarioId: number, projetoId: number): Promise<boolean>;
  vincularAoProjeto(usuarioId: number, projetoId: number, papel: Papel): Promise<boolean>;
}

export const CONVITE_REPOSITORY = Symbol('ConviteRepository');
