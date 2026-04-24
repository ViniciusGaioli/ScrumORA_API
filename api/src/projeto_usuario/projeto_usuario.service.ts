import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjetoUsuario } from './entities/projeto_usuario.entity';
import { User } from '../users/entities/user.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
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
  ) {}

  async create(projetoId: number, dto: CreateProjetoUsuarioDto): Promise<ProjetoUsuario> {
    const projeto = await this.projetoRepo.findOne({ where: { id: projetoId } });
    if (!projeto) {
      throw new NotFoundException(`Projeto ${projetoId} não encontrado`);
    }

    const usuario = await this.userRepo.findOne({ where: { id: dto.usuarioId } });
    if (!usuario) {
      throw new NotFoundException(`Usuário ${dto.usuarioId} não encontrado`);
    }

    const jaExiste = await this.puRepo.findOne({
      where: {
        usuario: { id: dto.usuarioId },
        projeto: { id: projetoId },
      },
    });
    if (jaExiste) {
      throw new ConflictException('Este usuário já é membro deste projeto');
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
      throw new NotFoundException(
        `Usuário ${usuarioId} não é membro do projeto ${projetoId}`,
      );
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
      throw new NotFoundException(
        `Usuário ${usuarioId} não é membro do projeto ${projetoId}`,
      );
    }
  }
}