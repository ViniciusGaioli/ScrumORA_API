import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AtividadeResponsavel } from './entities/atividade-responsavel.entity';
import { Atividade } from '../atividade/entities/atividade.entity';
import { ProjetoUsuario } from '../projeto_usuario/entities/projeto_usuario.entity';
import { ErroDominio, ErrosComuns, ErrosResponsavel } from '../common';

@Injectable()
export class AtividadeResponsavelAccess {
  constructor(
    @InjectRepository(Atividade)
    private readonly atividadeRepo: Repository<Atividade>,
    @InjectRepository(AtividadeResponsavel)
    private readonly arRepo: Repository<AtividadeResponsavel>,
    @InjectRepository(ProjetoUsuario)
    private readonly puRepo: Repository<ProjetoUsuario>,
  ) {}

  async porAtividade(usuarioId: number, atividadeId: number): Promise<void> {
    const atividade = await this.atividadeRepo.findOne({
      where: { id: atividadeId },
      relations: ['projeto'],
    });

    if (!atividade) throw new ErroDominio(ErrosResponsavel.NAO_ENCONTRADO);

    await this.garantirVinculo(usuarioId, atividade.projeto.id);
  }

  async porVinculo(usuarioId: number, vinculoId: number): Promise<void> {
    const vinculo = await this.arRepo.findOne({
      where: { id: vinculoId },
      relations: ['atividade', 'atividade.projeto'],
    });

    if (!vinculo) throw new ErroDominio(ErrosResponsavel.NAO_ENCONTRADO);

    await this.garantirVinculo(usuarioId, vinculo.atividade.projeto.id);
  }

  private async garantirVinculo(usuarioId: number, projetoId: number): Promise<void> {
    const participa = await this.puRepo.findOne({
      where: { usuario: { id: usuarioId }, projeto: { id: projetoId } },
    });

    if (!participa) throw new ErroDominio(ErrosComuns.SEM_PERMISSAO);
  }
}
