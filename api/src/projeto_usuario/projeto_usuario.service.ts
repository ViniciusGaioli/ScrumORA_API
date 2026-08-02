import { ErroDominio, ErrosMembro } from '../common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjetoUsuario } from './entities/projeto_usuario.entity';
import { User } from '../users/entities/user.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { AtividadeResponsavel } from '../atividade-responsavel/entities/atividade-responsavel.entity';
import { CreateProjetoUsuarioDto } from './dto/create-projeto_usuario.dto';
import { UpdateProjetoUsuarioDto } from './dto/update-projeto_usuario.dto';

@Injectable()
export class ProjetoUsuarioService {
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

  async create(projetoId: number, dto: CreateProjetoUsuarioDto): Promise<ProjetoUsuario> {
    const projeto = await this.projetoRepo.findOne({ where: { id: projetoId } });
    if (!projeto) {
      throw new ErroDominio(ErrosMembro.NAO_ENCONTRADO);
    }

    const usuario = await this.userRepo.findOne({ where: { id: dto.usuarioId } });
    if (!usuario) {
      throw new ErroDominio(ErrosMembro.NAO_ENCONTRADO);
    }

    const jaExiste = await this.puRepo.findOne({
      where: {
        usuario: { id: dto.usuarioId },
        projeto: { id: projetoId },
      },
    });
    if (jaExiste) {
      throw new ErroDominio(ErrosMembro.JA_PARTICIPA);
    }

    const pu = this.puRepo.create({ usuario, projeto, papel: dto.papel });
    return this.puRepo.save(pu);
  }

  findAllByProjeto(projetoId: number): Promise<ProjetoUsuario[]> {
    return this.puRepo.find({
      where: { projeto: { id: projetoId } },
      relations: ['usuario'],
    });
  }

  async findOne(projetoId: number, usuarioId: number): Promise<ProjetoUsuario> {
    const pu = await this.puRepo.findOne({
      where: {
        projeto: { id: projetoId },
        usuario: { id: usuarioId },
      },
      relations: ['usuario', 'projeto'],
    });
    if (!pu) {
      throw new ErroDominio(ErrosMembro.NAO_ENCONTRADO);
    }
    return pu;
  }

  async update(
    projetoId: number,
    usuarioId: number,
    dto: UpdateProjetoUsuarioDto,
  ): Promise<ProjetoUsuario> {
    const pu = await this.findOne(projetoId, usuarioId);
    pu.papel = dto.papel;
    return this.puRepo.save(pu);
  }

  async remove(projetoId: number, usuarioId: number): Promise<void> {
    const result = await this.puRepo.delete({
      projeto: { id: projetoId },
      usuario: { id: usuarioId },
    });
    if (result.affected === 0) {
      throw new ErroDominio(ErrosMembro.NAO_ENCONTRADO);
    }

    await this.arRepo.query(
      `DELETE FROM atividade_responsavel
       WHERE usuario_id = ?
       AND atividade_id IN (SELECT id FROM atividade WHERE projeto_id = ?)`,
      [usuarioId, projetoId],
    );
  }
}