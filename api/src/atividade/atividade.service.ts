import { ErroDominio, ErrosAtividade } from '../common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Atividade } from './entities/atividade.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { Sprint } from '../sprint/entities/sprint.entity';
import { CreateAtividadeDto } from './dto/create-atividade.dto';
import { UpdateAtividadeDto } from './dto/update-atividade.dto';

@Injectable()
export class AtividadeService {
  constructor(
    @InjectRepository(Atividade)
    private readonly atividadeRepo: Repository<Atividade>,
    @InjectRepository(Projeto)
    private readonly projetoRepo: Repository<Projeto>,
    @InjectRepository(Sprint)
    private readonly sprintRepo: Repository<Sprint>,
  ) {}

  async create(projetoId: number,dto: CreateAtividadeDto): Promise<Atividade> {
    const projeto = await this.projetoRepo.findOne({ where: { id: projetoId } });
    if (!projeto) {
      throw new ErroDominio(ErrosAtividade.NAO_ENCONTRADA);
    }

    let sprint: Sprint | undefined;
    if (dto.sprintId !== undefined) {
      const s = await this.sprintRepo.findOne({ where: { id: dto.sprintId } });
      if (!s) throw new ErroDominio(ErrosAtividade.NAO_ENCONTRADA);
      sprint = s;
    }

    this.validarDatas(dto.dataInicio, dto.dataFim);

    const atividade = this.atividadeRepo.create({
      nome: dto.nome,
      descricao: dto.descricao,
      dataInicio: new Date(dto.dataInicio),
      dataFim: new Date(dto.dataFim),
      etapa: dto.etapa,
      arquivada: dto.arquivada,
      projeto,
      sprint,
    });

    return this.atividadeRepo.save(atividade);
  }

  findAll(projetoId: number): Promise<Atividade[]> {
    return this.atividadeRepo.find({
      where: { projeto: { id: projetoId }, arquivada: false },
      relations: ['sprint', 'responsaveis', 'responsaveis.usuario', 'responsaveis.equipe'],
    });
  }

  async findOne(projetoId: number, id: number): Promise<Atividade> {
    const atividade = await this.atividadeRepo.findOne({
      where: { id, projeto: { id: projetoId } },
      relations: ['projeto'],
    });
    if (!atividade) throw new ErroDominio(ErrosAtividade.NAO_ENCONTRADA);
    return atividade;
  }

  async update(projetoId: number, id: number, dto: UpdateAtividadeDto): Promise<Atividade> {
    const atividade = await this.atividadeRepo.findOne({
      where: { id, projeto: { id: projetoId } },
      relations: ['projeto', 'sprint'],
    });
    if (!atividade) throw new ErroDominio(ErrosAtividade.NAO_ENCONTRADA);

    if (dto.sprintId !== undefined) {
      if (dto.sprintId === null) {
        (atividade as { sprint: Sprint | null }).sprint = null;
      } else {
        const sprint = await this.sprintRepo.findOne({
          where: { id: dto.sprintId, projeto: { id: projetoId } },
        });
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

    return this.atividadeRepo.save(atividade);
  }

  async arquivar(projetoId: number, id: number): Promise<Atividade> {
    const atividade = await this.findOne(projetoId, id);
    atividade.arquivada = true;
    return this.atividadeRepo.save(atividade);
  }

  async desarquivar(projetoId: number, id: number): Promise<Atividade> {
    const atividade = await this.findOne(projetoId, id);
    atividade.arquivada = false;
    return this.atividadeRepo.save(atividade);
  }

  async remove(projetoId: number, id: number): Promise<void> {
    const result = await this.atividadeRepo.delete({ id, projeto: { id: projetoId } });
    if (result.affected === 0) {
      throw new ErroDominio(ErrosAtividade.NAO_ENCONTRADA);
    }
  }

  private validarDatas(inicio: string, fim: string): void {
    if (new Date(fim) < new Date(inicio)) {
      throw new ErroDominio(ErrosAtividade.DATAS_INVALIDAS);
    }
  }
}