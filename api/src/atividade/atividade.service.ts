import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Atividade } from './entities/atividade.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { Sprint } from 'src/sprint/entities/sprint.entity';
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
      throw new NotFoundException(`Projeto ${projetoId} não encontrado`);
    }

    let sprint: Sprint | undefined;
    if (dto.sprintId !== undefined) {
      const s = await this.sprintRepo.findOne({ where: { id: dto.sprintId } });
      if (!s) throw new NotFoundException(`Sprint ${dto.sprintId} não encontrada`);
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
      relations: ['sprint', 'responsaveis', 'responsaveis.usuario'],
    });
  }

  async findOne(id: number): Promise<Atividade> {
    const atividade = await this.atividadeRepo.findOne({
      where: { id },
      relations: ['projeto'],
    });
    if (!atividade) throw new NotFoundException(`Atividade ${id} não encontrada`);
    return atividade;
  }

  async update(id: number, dto: UpdateAtividadeDto): Promise<Atividade> {
    const atividade = await this.findOne(id);

    if (dto.sprintId !== undefined) {
      if (dto.sprintId === null) {
        atividade.sprint = undefined;
      } else {
        const sprint = await this.sprintRepo.findOne({ where: { id: dto.sprintId } });
        if (!sprint) throw new NotFoundException(`Sprint ${dto.sprintId} não encontrada`);
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
      atividade.dataInicio.toISOString(),
      atividade.dataFim.toISOString(),
    );

    return this.atividadeRepo.save(atividade);
  }

  async arquivar(id: number): Promise<Atividade> {
    const atividade = await this.findOne(id);
    atividade.arquivada = true;
    return this.atividadeRepo.save(atividade);
  }

  async desarquivar(id: number): Promise<Atividade> {
    const atividade = await this.findOne(id);
    atividade.arquivada = false;
    return this.atividadeRepo.save(atividade);
  }

  async remove(id: number): Promise<void> {
    const result = await this.atividadeRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Atividade ${id} não encontrada`);
    }
  }

  private validarDatas(inicio: string, fim: string): void {
    if (new Date(fim) < new Date(inicio)) {
      throw new BadRequestException('A data de fim não pode ser anterior à data de início');
    }
  }
}