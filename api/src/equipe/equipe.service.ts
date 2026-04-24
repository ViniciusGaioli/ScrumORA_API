import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipe } from './entities/equipe.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { User } from '../users/entities/user.entity';
import { CreateEquipeDto } from './dto/create-equipe.dto';
import { UpdateEquipeDto } from './dto/update-equipe.dto';

@Injectable()
export class EquipeService {
  constructor(
    @InjectRepository(Equipe)
    private readonly equipeRepo: Repository<Equipe>,
    @InjectRepository(Projeto)
    private readonly projetoRepo: Repository<Projeto>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(projetoId: number, dto: CreateEquipeDto): Promise<Equipe> {
    const projeto = await this.projetoRepo.findOne({ where: { id: projetoId } });
    if (!projeto) {
      throw new NotFoundException(`Projeto ${projetoId} não encontrado`);
    }

    const equipe = this.equipeRepo.create({ nome: dto.nome, projeto });
    return this.equipeRepo.save(equipe);
  }

  findAll(projetoId: number): Promise<Equipe[]> {
    return this.equipeRepo.find({
      where: { projeto: { id: projetoId } },
      relations: ['projeto'],
    });
  }

  async findOne(id: number): Promise<Equipe> {
    const equipe = await this.equipeRepo.findOne({
      where: { id },
      relations: ['projeto', 'usuarios'],
    });
    if (!equipe) throw new NotFoundException(`Equipe ${id} não encontrada`);
    return equipe;
  }

  async update(id: number, dto: UpdateEquipeDto): Promise<Equipe> {
    const equipe = await this.findOne(id);

    if (dto.nome !== undefined) equipe.nome = dto.nome;

    return this.equipeRepo.save(equipe);
  }

  async remove(id: number): Promise<void> {
    const result = await this.equipeRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Equipe ${id} não encontrada`);
    }
  }


  async addMembro(equipeId: number, usuarioId: number): Promise<Equipe> {
    const equipe = await this.equipeRepo.findOne({
      where: { id: equipeId },
      relations: ['usuarios'],
    });
    if (!equipe) throw new NotFoundException(`Equipe ${equipeId} não encontrada`);

    const usuario = await this.userRepo.findOne({ where: { id: usuarioId } });
    if (!usuario) throw new NotFoundException(`Usuário ${usuarioId} não encontrado`);

    if (equipe.usuarios.some((u) => u.id === usuarioId)) {
      throw new ConflictException('Usuário já é membro desta equipe');
    }

    equipe.usuarios.push(usuario);
    return this.equipeRepo.save(equipe);
  }

  async removeMembro(equipeId: number, usuarioId: number): Promise<void> {
    const equipe = await this.equipeRepo.findOne({
      where: { id: equipeId },
      relations: ['usuarios'],
    });
    if (!equipe) throw new NotFoundException(`Equipe ${equipeId} não encontrada`);

    const tinha = equipe.usuarios.length;
    equipe.usuarios = equipe.usuarios.filter((u) => u.id !== usuarioId);

    if (equipe.usuarios.length === tinha) {
      throw new NotFoundException(`Usuário ${usuarioId} não é membro desta equipe`);
    }

    await this.equipeRepo.save(equipe);
  }

  async findMembros(equipeId: number): Promise<User[]> {
    const equipe = await this.equipeRepo.findOne({
      where: { id: equipeId },
      relations: ['usuarios'],
    });
    if (!equipe) throw new NotFoundException(`Equipe ${equipeId} não encontrada`);
    return equipe.usuarios;
  }
}