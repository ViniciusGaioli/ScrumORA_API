import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Atividade } from './entities/atividade.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { Sprint } from '../sprint/entities/sprint.entity';
import type { AtividadeRepository, CriarAtividade } from './atividade.repository';

const RELACOES_LISTA = ['sprint', 'responsaveis', 'responsaveis.usuario', 'responsaveis.equipe'];

@Injectable()
export class AtividadeTypeOrmRepository implements AtividadeRepository {
  constructor(
    @InjectRepository(Atividade)
    private readonly atividadeRepo: Repository<Atividade>,
    @InjectRepository(Projeto)
    private readonly projetoRepo: Repository<Projeto>,
    @InjectRepository(Sprint)
    private readonly sprintRepo: Repository<Sprint>,
  ) {}

  listarPorProjeto(projetoId: number): Promise<Atividade[]> {
    return this.atividadeRepo.find({
      where: { projeto: { id: projetoId }, arquivada: false },
      relations: RELACOES_LISTA,
    });
  }

  buscarNoProjeto(projetoId: number, id: number, comSprint = false): Promise<Atividade | null> {
    return this.atividadeRepo.findOne({
      where: { id, projeto: { id: projetoId } },
      relations: comSprint ? ['projeto', 'sprint'] : ['projeto'],
    });
  }

  async criar(dados: CriarAtividade): Promise<Atividade> {
    const projeto = await this.projetoRepo.findOne({ where: { id: dados.projetoId } });
    if (!projeto) throw new Error('projeto inexistente');

    const sprint =
      dados.sprintId === undefined
        ? undefined
        : ((await this.buscarSprintNoProjeto(dados.projetoId, dados.sprintId)) ?? undefined);

    const atividade = this.atividadeRepo.create({
      nome: dados.nome,
      descricao: dados.descricao,
      dataInicio: dados.dataInicio,
      dataFim: dados.dataFim,
      etapa: dados.etapa,
      arquivada: dados.arquivada,
      projeto,
      sprint,
    });

    return this.atividadeRepo.save(atividade);
  }

  salvar(atividade: Atividade): Promise<Atividade> {
    return this.atividadeRepo.save(atividade);
  }

  async remover(projetoId: number, id: number): Promise<boolean> {
    const resultado = await this.atividadeRepo.delete({ id, projeto: { id: projetoId } });
    return (resultado.affected ?? 0) > 0;
  }

  projetoExiste(projetoId: number): Promise<boolean> {
    return this.projetoRepo.existsBy({ id: projetoId });
  }

  buscarSprintNoProjeto(projetoId: number, sprintId: number): Promise<Sprint | null> {
    return this.sprintRepo.findOne({
      where: { id: sprintId, projeto: { id: projetoId } },
    });
  }
}
