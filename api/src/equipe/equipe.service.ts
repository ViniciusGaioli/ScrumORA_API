import { ErroDominio, ErrosEquipe } from '../common';
import { Injectable } from '@nestjs/common';
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
      throw new ErroDominio(ErrosEquipe.NAO_ENCONTRADA);
    }

    const equipe = this.equipeRepo.create({ nome: dto.nome, projeto });
    return this.equipeRepo.save(equipe);
  }

  findAll(projetoId: number): Promise<Equipe[]> {
    return this.equipeRepo.find({
      where: { projeto: { id: projetoId } },
      relations: ['usuarios'],
    });
  }

  async findOne(projetoId: number, id: number): Promise<Equipe> {
    const equipe = await this.equipeRepo.findOne({
      where: { id, projeto: { id: projetoId } },
      relations: ['projeto', 'usuarios'],
    });
    if (!equipe) throw new ErroDominio(ErrosEquipe.NAO_ENCONTRADA);
    return equipe;
  }

  async update(projetoId: number, id: number, dto: UpdateEquipeDto): Promise<Equipe> {
    const equipe = await this.findOne(projetoId, id);

    if (dto.nome !== undefined) equipe.nome = dto.nome;

    return this.equipeRepo.save(equipe);
  }

  async remove(projetoId: number, id: number): Promise<void> {
    const result = await this.equipeRepo.delete({ id, projeto: { id: projetoId } });
    if (result.affected === 0) {
      throw new ErroDominio(ErrosEquipe.NAO_ENCONTRADA);
    }
  }


  async addMembro(projetoId: number, equipeId: number, usuarioId: number): Promise<Equipe> {
    const equipe = await this.equipeRepo.findOne({
      where: { id: equipeId, projeto: { id: projetoId } },
      relations: ['usuarios'],
    });
    if (!equipe) throw new ErroDominio(ErrosEquipe.NAO_ENCONTRADA);

    const usuario = await this.userRepo.findOne({ where: { id: usuarioId } });
    if (!usuario) throw new ErroDominio(ErrosEquipe.NAO_ENCONTRADA);

    if (equipe.usuarios.some((u) => u.id === usuarioId)) {
      throw new ErroDominio(ErrosEquipe.NOME_EM_USO);
    }

    equipe.usuarios.push(usuario);
    return this.equipeRepo.save(equipe);
  }

  async removeMembro(projetoId: number, equipeId: number, usuarioId: number): Promise<void> {
    const equipe = await this.equipeRepo.findOne({
      where: { id: equipeId, projeto: { id: projetoId } },
      relations: ['usuarios'],
    });
    if (!equipe) throw new ErroDominio(ErrosEquipe.NAO_ENCONTRADA);

    const tinha = equipe.usuarios.length;
    equipe.usuarios = equipe.usuarios.filter((u) => u.id !== usuarioId);

    if (equipe.usuarios.length === tinha) {
      throw new ErroDominio(ErrosEquipe.NAO_ENCONTRADA);
    }

    await this.equipeRepo.save(equipe);
  }

  async findMembros(projetoId: number, equipeId: number): Promise<User[]> {
    const equipe = await this.equipeRepo.findOne({
      where: { id: equipeId, projeto: { id: projetoId } },
      relations: ['usuarios'],
    });
    if (!equipe) throw new ErroDominio(ErrosEquipe.NAO_ENCONTRADA);
    return equipe.usuarios;
  }
}