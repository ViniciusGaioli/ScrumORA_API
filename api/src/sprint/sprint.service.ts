import { Inject, Injectable } from '@nestjs/common';
import { ErroDominio, ErrosSprint } from '../common';
import { Sprint } from './entities/sprint.entity';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { SPRINT_REPOSITORY, type SprintRepository } from './sprint.repository';

@Injectable()
export class SprintService {
  constructor(
    @Inject(SPRINT_REPOSITORY)
    private readonly repositorio: SprintRepository,
  ) {}

  async create(projetoId: number, dto: CreateSprintDto): Promise<Sprint> {
    if (!(await this.repositorio.projetoExiste(projetoId))) {
      throw new ErroDominio(ErrosSprint.NAO_ENCONTRADA);
    }

    this.validarDatas(dto.dataInicio, dto.dataFim);

    return this.repositorio.criar({
      projetoId,
      nome: dto.nome,
      dataInicio: new Date(dto.dataInicio),
      dataFim: new Date(dto.dataFim),
      status: dto.status,
    });
  }

  findAll(projetoId: number): Promise<Sprint[]> {
    return this.repositorio.listarPorProjeto(projetoId);
  }

  async findOne(projetoId: number, id: number): Promise<Sprint> {
    const sprint = await this.repositorio.buscarNoProjeto(projetoId, id);
    if (!sprint) throw new ErroDominio(ErrosSprint.NAO_ENCONTRADA);
    return sprint;
  }

  async update(projetoId: number, id: number, dto: UpdateSprintDto): Promise<Sprint> {
    const sprint = await this.findOne(projetoId, id);

    if (dto.nome !== undefined) sprint.nome = dto.nome;
    if (dto.status !== undefined) sprint.status = dto.status;
    if (dto.dataInicio !== undefined) sprint.dataInicio = new Date(dto.dataInicio);
    if (dto.dataFim !== undefined) sprint.dataFim = new Date(dto.dataFim);

    this.validarDatas(sprint.dataInicio, sprint.dataFim);

    return this.repositorio.salvar(sprint);
  }

  async remove(projetoId: number, id: number): Promise<void> {
    const removeu = await this.repositorio.remover(projetoId, id);
    if (!removeu) throw new ErroDominio(ErrosSprint.NAO_ENCONTRADA);
  }

  private validarDatas(inicio: string | Date, fim: string | Date): void {
    if (new Date(fim) < new Date(inicio)) {
      throw new ErroDominio(ErrosSprint.DATAS_INVALIDAS);
    }
  }
}
