import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjetoUsuario } from './entities/projeto_usuario.entity';
import { Papel } from './enums/papel.enum';
import { User } from '../users/entities/user.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { AtividadeResponsavel } from '../atividade-responsavel/entities/atividade-responsavel.entity';
import type { ProjetoUsuarioRepository } from './projeto_usuario.repository';

@Injectable()
export class ProjetoUsuarioTypeOrmRepository implements ProjetoUsuarioRepository {
  constructor(
    @InjectRepository(ProjetoUsuario)
    private readonly puRepo: Repository<ProjetoUsuario>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Projeto)
    private readonly projetoRepo: Repository<Projeto>,
    @InjectRepository(AtividadeResponsavel)
    private readonly arRepo: Repository<AtividadeResponsavel>,
  ) {}

  listarPorProjeto(projetoId: number): Promise<ProjetoUsuario[]> {
    return this.puRepo.find({
      where: { projeto: { id: projetoId } },
      relations: ['usuario'],
    });
  }

  buscarVinculo(projetoId: number, usuarioId: number): Promise<ProjetoUsuario | null> {
    return this.puRepo.findOne({
      where: { projeto: { id: projetoId }, usuario: { id: usuarioId } },
      relations: ['usuario', 'projeto'],
    });
  }

  async vincular(projetoId: number, usuarioId: number, papel: Papel): Promise<ProjetoUsuario> {
    const projeto = await this.projetoRepo.findOne({ where: { id: projetoId } });
    const usuario = await this.userRepo.findOne({ where: { id: usuarioId } });

    if (!projeto || !usuario) throw new Error('projeto ou usuário inexistente');

    return this.puRepo.save(this.puRepo.create({ usuario, projeto, papel }));
  }

  salvar(vinculo: ProjetoUsuario): Promise<ProjetoUsuario> {
    return this.puRepo.save(vinculo);
  }

  async desvincular(projetoId: number, usuarioId: number): Promise<boolean> {
    const resultado = await this.puRepo.delete({
      projeto: { id: projetoId },
      usuario: { id: usuarioId },
    });
    return (resultado.affected ?? 0) > 0;
  }

  async desatribuirAtividadesDoProjeto(projetoId: number, usuarioId: number): Promise<void> {
    await this.arRepo.query(
      `DELETE FROM atividade_responsavel
       WHERE usuario_id = ?
       AND atividade_id IN (SELECT id FROM atividade WHERE projeto_id = ?)`,
      [usuarioId, projetoId],
    );
  }

  projetoExiste(projetoId: number): Promise<boolean> {
    return this.projetoRepo.existsBy({ id: projetoId });
  }

  usuarioExiste(usuarioId: number): Promise<boolean> {
    return this.userRepo.existsBy({ id: usuarioId });
  }
}
