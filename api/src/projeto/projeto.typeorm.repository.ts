import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Projeto } from './entities/projeto.entity';
import { ProjetoUsuario } from '../projeto_usuario/entities/projeto_usuario.entity';
import { User } from '../users/entities/user.entity';
import { Papel } from '../projeto_usuario/enums/papel.enum';
import type { ProjetoRepository } from './projeto.repository';

const RELACOES_DO_PAINEL = [
  'projeto',
  'projeto.membros',
  'projeto.membros.usuario',
  'projeto.sprints',
  'projeto.atividades',
];

@Injectable()
export class ProjetoTypeOrmRepository implements ProjetoRepository {
  constructor(
    @InjectRepository(Projeto)
    private readonly projetoRepo: Repository<Projeto>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  buscar(id: number): Promise<Projeto | null> {
    return this.projetoRepo.findOne({ where: { id } });
  }

  async criarComScrumMaster(
    criadorId: number,
    dados: { nome: string; descricao: string },
  ): Promise<Projeto> {
    const criador = await this.userRepo.findOne({ where: { id: criadorId } });
    if (!criador) throw new Error('usuário inexistente');

    return this.dataSource.transaction(async manager => {
      const projeto = await manager.save(manager.create(Projeto, dados));

      await manager.save(
        manager.create(ProjetoUsuario, {
          usuario: criador,
          projeto,
          papel: Papel.SCRUM_MASTER,
        }),
      );

      return projeto;
    });
  }

  listarVinculosDoUsuario(usuarioId: number): Promise<ProjetoUsuario[]> {
    return this.dataSource.getRepository(ProjetoUsuario).find({
      where: { usuario: { id: usuarioId } },
      relations: RELACOES_DO_PAINEL,
    });
  }

  salvar(projeto: Projeto): Promise<Projeto> {
    return this.projetoRepo.save(projeto);
  }

  async remover(id: number): Promise<boolean> {
    const resultado = await this.projetoRepo.delete(id);
    return (resultado.affected ?? 0) > 0;
  }

  usuarioExiste(usuarioId: number): Promise<boolean> {
    return this.userRepo.existsBy({ id: usuarioId });
  }
}
