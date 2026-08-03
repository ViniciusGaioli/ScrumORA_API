import { Inject, Injectable } from '@nestjs/common';
import { ErroDominio, ErrosAtividade } from '../common';
import { Atividade } from './entities/atividade.entity';
import { Sprint } from '../sprint/entities/sprint.entity';
import { CreateAtividadeDto } from './dto/create-atividade.dto';
import { UpdateAtividadeDto } from './dto/update-atividade.dto';
import { ATIVIDADE_REPOSITORY, type AtividadeRepository } from './atividade.repository';

@Injectable()
export class AtividadeService {
  constructor(
    @Inject(ATIVIDADE_REPOSITORY)
    private readonly repositorio: AtividadeRepository,
  ) {}

  async create(projetoId: number, dto: CreateAtividadeDto): Promise<Atividade> {
    if (!(await this.repositorio.projetoExiste(projetoId))) {
      throw new ErroDominio(ErrosAtividade.NAO_ENCONTRADA);
    }

    if (dto.sprintId !== undefined) {
      const sprint = await this.repositorio.buscarSprintNoProjeto(projetoId, dto.sprintId);
      if (!sprint) throw new ErroDominio(ErrosAtividade.NAO_ENCONTRADA);
    }

    this.validarDatas(dto.dataInicio, dto.dataFim);

    return this.repositorio.criar({
      projetoId,
      nome: dto.nome,
      descricao: dto.descricao,
      dataInicio: new Date(dto.dataInicio),
      dataFim: new Date(dto.dataFim),
      etapa: dto.etapa,
      arquivada: dto.arquivada,
      sprintId: dto.sprintId,
    });
  }

  findAll(projetoId: number): Promise<Atividade[]> {
    return this.repositorio.listarPorProjeto(projetoId);
  }

  async findOne(projetoId: number, id: number): Promise<Atividade> {
    const atividade = await this.repositorio.buscarNoProjeto(projetoId, id);
    if (!atividade) throw new ErroDominio(ErrosAtividade.NAO_ENCONTRADA);
    return atividade;
  }

  async update(projetoId: number, id: number, dto: UpdateAtividadeDto): Promise<Atividade> {
    const atividade = await this.repositorio.buscarNoProjeto(projetoId, id, true);
    if (!atividade) throw new ErroDominio(ErrosAtividade.NAO_ENCONTRADA);

    if (dto.sprintId !== undefined) {
      if (dto.sprintId === null) {
        (atividade as { sprint: Sprint | null }).sprint = null;
      } else {
        const sprint = await this.repositorio.buscarSprintNoProjeto(projetoId, dto.sprintId);
        if (!sprint) throw new ErroDominio(ErrosAtividade.NAO_ENCONTRADA);
        atividade.sprint = sprint;
      }
    }

    if (dto.nome !== undefined) atividade.nome = dto.nome;
    if (dto.descricao !== undefined) atividade.descricao = dto.descricao;
    if (dto.etapa !== undefined) atividade.etapa = dto.etapa;
    if (dto.arquivada !== undefined) atividade.arquivada = dto.arquivada;
    if (dto.dataInicio !== undefined) atividade.dataInicio = new Date(dto.dataInicio);
    if (dto.dataFim !== undefined) atividade.dataFim = new Date(dto.dataFim);

    this.validarDatas(
      new Date(atividade.dataInicio).toISOString(),
      new Date(atividade.dataFim).toISOString(),
    );

    return this.repositorio.salvar(atividade);
  }

  async arquivar(projetoId: number, id: number): Promise<Atividade> {
    const atividade = await this.findOne(projetoId, id);
    atividade.arquivada = true;
    return this.repositorio.salvar(atividade);
  }

  async desarquivar(projetoId: number, id: number): Promise<Atividade> {
    const atividade = await this.findOne(projetoId, id);
    atividade.arquivada = false;
    return this.repositorio.salvar(atividade);
  }

  async remove(projetoId: number, id: number): Promise<void> {
    const removeu = await this.repositorio.remover(projetoId, id);
    if (!removeu) throw new ErroDominio(ErrosAtividade.NAO_ENCONTRADA);
  }

  private validarDatas(inicio: string, fim: string): void {
    if (new Date(fim) < new Date(inicio)) {
      throw new ErroDominio(ErrosAtividade.DATAS_INVALIDAS);
    }
  }
}
