import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sprint } from './entities/sprint.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import type { CriarSprint, SprintRepository } from './sprint.repository';

@Injectable()
export class SprintTypeOrmRepository implements SprintRepository {
  constructor(
    @InjectRepository(Sprint)
    private readonly sprintRepo: Repository<Sprint>,
    @InjectRepository(Projeto)
    private readonly projetoRepo: Repository<Projeto>,
  ) {}

  listarPorProjeto(projetoId: number): Promise<Sprint[]> {
    return this.sprintRepo.find({
      where: { projeto: { id: projetoId } },
      relations: ['projeto'],
    });
  }

  buscarNoProjeto(projetoId: number, id: number): Promise<Sprint | null> {
    return this.sprintRepo.findOne({
      where: { id, projeto: { id: projetoId } },
      relations: ['projeto', 'atividades'],
    });
  }

  async criar(dados: CriarSprint): Promise<Sprint> {
    const projeto = await this.projetoRepo.findOne({ where: { id: dados.projetoId } });
    if (!projeto) throw new Error('projeto inexistente');

    const sprint = this.sprintRepo.create({
      nome: dados.nome,
      dataInicio: dados.dataInicio,
      dataFim: dados.dataFim,
      status: dados.status,
      projeto,
    });

    return this.sprintRepo.save(sprint);
  }

  salvar(sprint: Sprint): Promise<Sprint> {
    return this.sprintRepo.save(sprint);
  }

  async remover(projetoId: number, id: number): Promise<boolean> {
    const resultado = await this.sprintRepo.delete({ id, projeto: { id: projetoId } });
    return (resultado.affected ?? 0) > 0;
  }

  async projetoExiste(projetoId: number): Promise<boolean> {
    return this.projetoRepo.existsBy({ id: projetoId });
  }
}
