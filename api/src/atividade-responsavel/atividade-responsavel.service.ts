import { Inject, Injectable } from '@nestjs/common';
import { ErroDominio, ErrosResponsavel } from '../common';
import { AtividadeResponsavel } from './entities/atividade-responsavel.entity';
import { CreateAtividadeResponsavelDto } from './dto/create-atividade-responsavel.dto';
import {
  ATIVIDADE_RESPONSAVEL_REPOSITORY,
  type AtividadeResponsavelRepository,
} from './atividade-responsavel.repository';

@Injectable()
export class AtividadeResponsavelService {
  constructor(
    @Inject(ATIVIDADE_RESPONSAVEL_REPOSITORY)
    private readonly repositorio: AtividadeResponsavelRepository,
  ) {}

  async create(dto: CreateAtividadeResponsavelDto): Promise<AtividadeResponsavel[]> {
    const usuarioIds = dto.usuarioIds ?? [];
    const equipeIds = dto.equipeIds ?? [];

    if (usuarioIds.length === 0 && equipeIds.length === 0) {
      throw new ErroDominio(ErrosResponsavel.NAO_ENCONTRADO);
    }

    if (!(await this.repositorio.atividadeExiste(dto.atividadeId))) {
      throw new ErroDominio(ErrosResponsavel.NAO_ENCONTRADO);
    }

    const usuariosExistentes = await this.repositorio.idsDeUsuariosExistentes(usuarioIds);
    if (usuariosExistentes.length !== usuarioIds.length) {
      throw new ErroDominio(ErrosResponsavel.NAO_ENCONTRADO);
    }

    const equipesExistentes = await this.repositorio.idsDeEquipesExistentes(equipeIds);
    if (equipesExistentes.length !== equipeIds.length) {
      throw new ErroDominio(ErrosResponsavel.NAO_ENCONTRADO);
    }

    const jaVinculados = await this.repositorio.listarPorAtividade(dto.atividadeId);
    const usuariosJa = jaVinculados.filter(r => r.usuario).map(r => r.usuario!.id);
    const equipesJa = jaVinculados.filter(r => r.equipe).map(r => r.equipe!.id);

    const duplicado =
      usuarioIds.some(id => usuariosJa.includes(id)) ||
      equipeIds.some(id => equipesJa.includes(id));

    if (duplicado) {
      throw new ErroDominio(ErrosResponsavel.VINCULO_DUPLICADO);
    }

    return this.repositorio.vincular(dto.atividadeId, usuarioIds, equipeIds);
  }

  async findOne(id: number): Promise<AtividadeResponsavel> {
    const vinculo = await this.repositorio.buscar(id);
    if (!vinculo) throw new ErroDominio(ErrosResponsavel.NAO_ENCONTRADO);
    return vinculo;
  }

  findByAtividade(atividadeId: number): Promise<AtividadeResponsavel[]> {
    return this.repositorio.listarPorAtividade(atividadeId);
  }

  async remove(id: number): Promise<void> {
    const removeu = await this.repositorio.remover(id);
    if (!removeu) throw new ErroDominio(ErrosResponsavel.NAO_ENCONTRADO);
  }
}
