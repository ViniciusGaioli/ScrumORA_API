import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipe } from './entities/equipe.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { User } from '../users/entities/user.entity';
import type { EquipeRepository } from './equipe.repository';

@Injectable()
export class EquipeTypeOrmRepository implements EquipeRepository {
  constructor(
    @InjectRepository(Equipe)
    private readonly equipeRepo: Repository<Equipe>,
    @InjectRepository(Projeto)
    private readonly projetoRepo: Repository<Projeto>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  listarPorProjeto(projetoId: number): Promise<Equipe[]> {
    return this.equipeRepo.find({
      where: { projeto: { id: projetoId } },
      relations: ['usuarios'],
    });
  }

  buscarNoProjeto(projetoId: number, id: number): Promise<Equipe | null> {
    return this.equipeRepo.findOne({
      where: { id, projeto: { id: projetoId } },
      relations: ['projeto', 'usuarios'],
    });
  }

  buscarComUsuarios(projetoId: number, id: number): Promise<Equipe | null> {
    return this.equipeRepo.findOne({
      where: { id, projeto: { id: projetoId } },
      relations: ['usuarios'],
    });
  }

  async criar(projetoId: number, nome: string): Promise<Equipe> {
    const projeto = await this.projetoRepo.findOne({ where: { id: projetoId } });
    if (!projeto) throw new Error('projeto inexistente');

    return this.equipeRepo.save(this.equipeRepo.create({ nome, projeto }));
  }

  salvar(equipe: Equipe): Promise<Equipe> {
    return this.equipeRepo.save(equipe);
  }

  async remover(projetoId: number, id: number): Promise<boolean> {
    const resultado = await this.equipeRepo.delete({ id, projeto: { id: projetoId } });
    return (resultado.affected ?? 0) > 0;
  }

  projetoExiste(projetoId: number): Promise<boolean> {
    return this.projetoRepo.existsBy({ id: projetoId });
  }

  buscarUsuario(usuarioId: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id: usuarioId } });
  }
}
