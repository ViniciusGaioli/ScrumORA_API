import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sprint } from './entities/sprint.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';

@Injectable()
export class SprintService {
  constructor(
    @InjectRepository(Sprint)
    private readonly sprintRepo: Repository<Sprint>,
    @InjectRepository(Projeto)
    private readonly projetoRepo: Repository<Projeto>,
  ) {}

  async create(dto: CreateSprintDto): Promise<Sprint> {
    const projeto = await this.projetoRepo.findOne({ where: { id: dto.projetoId } });
    if (!projeto) {
      throw new NotFoundException(`Projeto ${dto.projetoId} não encontrado`);
    }

    this.validarDatas(dto.dataInicio, dto.dataFim);

    const sprint = this.sprintRepo.create({
      nome: dto.nome,
      dataInicio: new Date(dto.dataInicio),
      dataFim: new Date(dto.dataFim),
      status: dto.status,
      projeto,
    });

    return this.sprintRepo.save(sprint);
  }

  findAll(): Promise<Sprint[]> {
    return this.sprintRepo.find({ relations: ['projeto'] });
  }

  async findOne(id: number): Promise<Sprint> {
    const sprint = await this.sprintRepo.findOne({
      where: { id },
      relations: ['projeto', 'atividades'],
    });
    if (!sprint) throw new NotFoundException(`Sprint ${id} não encontrada`);
    return sprint;
  }

  findByProjeto(projetoId: number): Promise<Sprint[]> {
    return this.sprintRepo.find({ where: { projeto: { id: projetoId } } });
  }

  async update(id: number, dto: UpdateSprintDto): Promise<Sprint> {
    const sprint = await this.findOne(id);

    if (dto.projetoId !== undefined) {
      const projeto = await this.projetoRepo.findOne({ where: { id: dto.projetoId } });
      if (!projeto) throw new NotFoundException(`Projeto ${dto.projetoId} não encontrado`);
      sprint.projeto = projeto;
    }

    if (dto.nome !== undefined) sprint.nome = dto.nome;
    if (dto.status !== undefined) sprint.status = dto.status;
    if (dto.dataInicio !== undefined) sprint.dataInicio = new Date(dto.dataInicio);
    if (dto.dataFim !== undefined) sprint.dataFim = new Date(dto.dataFim);

    this.validarDatas(
      sprint.dataInicio.toISOString(),
      sprint.dataFim.toISOString(),
    );

    return this.sprintRepo.save(sprint);
  }

  async remove(id: number): Promise<void> {
    const result = await this.sprintRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Sprint ${id} não encontrada`);
    }
  }

  private validarDatas(inicio: string, fim: string): void {
    if (new Date(fim) < new Date(inicio)) {
      throw new BadRequestException('A data de fim não pode ser anterior à data de início');
    }
  }
}