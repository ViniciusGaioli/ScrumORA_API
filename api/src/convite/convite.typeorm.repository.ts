import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Convite } from './entities/convite.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { ProjetoUsuario } from '../projeto_usuario/entities/projeto_usuario.entity';
import { User } from '../users/entities/user.entity';
import { Papel } from '../projeto_usuario/enums/papel.enum';
import type { ConviteRepository, CriarConvite } from './convite.repository';

@Injectable()
export class ConviteTypeOrmRepository implements ConviteRepository {
  constructor(
    @InjectRepository(Convite)
    private readonly conviteRepo: Repository<Convite>,
    @InjectRepository(Projeto)
    private readonly projetoRepo: Repository<Projeto>,
    @InjectRepository(ProjetoUsuario)
    private readonly puRepo: Repository<ProjetoUsuario>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async buscarProjeto(projetoId: number): Promise<{ id: number; nome: string } | null> {
    const projeto = await this.projetoRepo.findOne({ where: { id: projetoId } });
    return projeto ? { id: projeto.id, nome: projeto.nome } : null;
  }

  async criar(dados: CriarConvite): Promise<Convite> {
    const projeto = await this.projetoRepo.findOne({ where: { id: dados.projetoId } });
    if (!projeto) throw new Error('projeto inexistente');

    return this.conviteRepo.save(
      this.conviteRepo.create({
        token: dados.token,
        projeto,
        email: dados.email,
        papel: dados.papel,
        expiresAt: dados.expiresAt,
        usadoEm: null,
      }),
    );
  }

  buscarPorToken(token: string): Promise<Convite | null> {
    return this.conviteRepo.findOne({ where: { token }, relations: ['projeto'] });
  }

  async marcarComoUsado(convite: Convite): Promise<void> {
    convite.usadoEm = new Date();
    await this.conviteRepo.save(convite);
  }

  async participaDoProjeto(usuarioId: number, projetoId: number): Promise<boolean> {
    return this.puRepo.exists({
      where: { usuario: { id: usuarioId }, projeto: { id: projetoId } },
    });
  }

  async vincularAoProjeto(usuarioId: number, projetoId: number, papel: Papel): Promise<boolean> {
    const usuario = await this.userRepo.findOne({ where: { id: usuarioId } });
    const projeto = await this.projetoRepo.findOne({ where: { id: projetoId } });

    if (!usuario || !projeto) return false;

    await this.puRepo.save(this.puRepo.create({ usuario, projeto, papel }));
    return true;
  }
}
