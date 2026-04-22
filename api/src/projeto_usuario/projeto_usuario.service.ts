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

  async create(dto: CreateProjetoUsuarioDto): Promise<ProjetoUsuario> {
    const usuario = await this.userRepo.findOne({ where: { id: dto.usuarioId } });
    if (!usuario) throw new NotFoundException(`Usuário ${dto.usuarioId} não encontrado`);

    const projeto = await this.projetoRepo.findOne({ where: { id: dto.projetoId } });
    if (!projeto) throw new NotFoundException(`Projeto ${dto.projetoId} não encontrado`);

    const jaExiste = await this.puRepo.findOne({
      where: { usuario: { id: dto.usuarioId }, projeto: { id: dto.projetoId } },
    });
    if (jaExiste) {
      throw new ConflictException('Este usuário já está associado a este projeto');
    }

    const pu = this.puRepo.create({ usuario, projeto, papel: dto.papel });
    return this.puRepo.save(pu);
  }

  findAll(): Promise<ProjetoUsuario[]> {
    return this.puRepo.find({ relations: ['usuario', 'projeto'] });
  }

  async findOne(id: number): Promise<ProjetoUsuario> {
    const pu = await this.puRepo.findOne({
      where: { id },
      relations: ['usuario', 'projeto'],
    });
    if (!pu) throw new NotFoundException(`Associação ${id} não encontrada`);
    return pu;
  }

  findByProjeto(projetoId: number): Promise<ProjetoUsuario[]> {
    return this.puRepo.find({
      where: { projeto: { id: projetoId } },
      relations: ['usuario'],
    });
  }

  findByUsuario(usuarioId: number): Promise<ProjetoUsuario[]> {
    return this.puRepo.find({
      where: { usuario: { id: usuarioId } },
      relations: ['projeto'],
    });
  }

  async update(id: number, dto: UpdateProjetoUsuarioDto): Promise<ProjetoUsuario> {
    const pu = await this.findOne(id);
    pu.papel = dto.papel;
    return this.puRepo.save(pu);
  }

  async remove(id: number): Promise<void> {
    const result = await this.puRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Associação ${id} não encontrada`);
    }
  }
}