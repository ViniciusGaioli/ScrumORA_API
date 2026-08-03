import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { AtividadeResponsavel } from './entities/atividade-responsavel.entity';
import { Atividade } from '../atividade/entities/atividade.entity';
import { User } from '../users/entities/user.entity';
import { Equipe } from '../equipe/entities/equipe.entity';
import type { AtividadeResponsavelRepository } from './atividade-responsavel.repository';

@Injectable()
export class AtividadeResponsavelTypeOrmRepository implements AtividadeResponsavelRepository {
  constructor(
    @InjectRepository(AtividadeResponsavel)
    private readonly arRepo: Repository<AtividadeResponsavel>,
    @InjectRepository(Atividade)
    private readonly atividadeRepo: Repository<Atividade>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Equipe)
    private readonly equipeRepo: Repository<Equipe>,
    private readonly dataSource: DataSource,
  ) {}

  atividadeExiste(atividadeId: number): Promise<boolean> {
    return this.atividadeRepo.existsBy({ id: atividadeId });
  }

  async idsDeUsuariosExistentes(usuarioIds: number[]): Promise<number[]> {
    if (usuarioIds.length === 0) return [];
    const usuarios = await this.userRepo.find({ where: { id: In(usuarioIds) } });
    return usuarios.map(usuario => usuario.id);
  }

  async idsDeEquipesExistentes(equipeIds: number[]): Promise<number[]> {
    if (equipeIds.length === 0) return [];
    const equipes = await this.equipeRepo.find({ where: { id: In(equipeIds) } });
    return equipes.map(equipe => equipe.id);
  }

  listarPorAtividade(atividadeId: number): Promise<AtividadeResponsavel[]> {
    return this.arRepo.find({
      where: { atividade: { id: atividadeId } },
      relations: ['usuario', 'equipe'],
    });
  }

  buscar(id: number): Promise<AtividadeResponsavel | null> {
    return this.arRepo.findOne({
      where: { id },
      relations: ['atividade', 'usuario', 'equipe'],
    });
  }

  async vincular(
    atividadeId: number,
    usuarioIds: number[],
    equipeIds: number[],
  ): Promise<AtividadeResponsavel[]> {
    const atividade = await this.atividadeRepo.findOne({ where: { id: atividadeId } });
    if (!atividade) throw new Error('atividade inexistente');

    const usuarios = await this.userRepo.find({ where: { id: In(usuarioIds.length ? usuarioIds : [0]) } });
    const equipes = await this.equipeRepo.find({ where: { id: In(equipeIds.length ? equipeIds : [0]) } });

    const novos = [
      ...usuarios.map(usuario => this.arRepo.create({ atividade, usuario })),
      ...equipes.map(equipe => this.arRepo.create({ atividade, equipe })),
    ];

    return this.dataSource.transaction(manager => manager.save(AtividadeResponsavel, novos));
  }

  async remover(id: number): Promise<boolean> {
    const resultado = await this.arRepo.delete(id);
    return (resultado.affected ?? 0) > 0;
  }
}
