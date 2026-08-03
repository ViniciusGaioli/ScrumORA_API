import { Inject, Injectable } from '@nestjs/common';
import { ErroDominio, ErrosEquipe } from '../common';
import { Equipe } from './entities/equipe.entity';
import { User } from '../users/entities/user.entity';
import { CreateEquipeDto } from './dto/create-equipe.dto';
import { UpdateEquipeDto } from './dto/update-equipe.dto';
import { EQUIPE_REPOSITORY, type EquipeRepository } from './equipe.repository';

@Injectable()
export class EquipeService {
  constructor(
    @Inject(EQUIPE_REPOSITORY)
    private readonly repositorio: EquipeRepository,
  ) {}

  async create(projetoId: number, dto: CreateEquipeDto): Promise<Equipe> {
    if (!(await this.repositorio.projetoExiste(projetoId))) {
      throw new ErroDominio(ErrosEquipe.NAO_ENCONTRADA);
    }

    return this.repositorio.criar(projetoId, dto.nome);
  }

  findAll(projetoId: number): Promise<Equipe[]> {
    return this.repositorio.listarPorProjeto(projetoId);
  }

  async findOne(projetoId: number, id: number): Promise<Equipe> {
    const equipe = await this.repositorio.buscarNoProjeto(projetoId, id);
    if (!equipe) throw new ErroDominio(ErrosEquipe.NAO_ENCONTRADA);
    return equipe;
  }

  async update(projetoId: number, id: number, dto: UpdateEquipeDto): Promise<Equipe> {
    const equipe = await this.findOne(projetoId, id);

    if (dto.nome !== undefined) equipe.nome = dto.nome;

    return this.repositorio.salvar(equipe);
  }

  async remove(projetoId: number, id: number): Promise<void> {
    const removeu = await this.repositorio.remover(projetoId, id);
    if (!removeu) throw new ErroDominio(ErrosEquipe.NAO_ENCONTRADA);
  }

  async addMembro(projetoId: number, equipeId: number, usuarioId: number): Promise<Equipe> {
    const equipe = await this.repositorio.buscarComUsuarios(projetoId, equipeId);
    if (!equipe) throw new ErroDominio(ErrosEquipe.NAO_ENCONTRADA);

    const usuario = await this.repositorio.buscarUsuario(usuarioId);
    if (!usuario) throw new ErroDominio(ErrosEquipe.NAO_ENCONTRADA);

    if (equipe.usuarios.some(u => u.id === usuarioId)) {
      throw new ErroDominio(ErrosEquipe.NOME_EM_USO);
    }

    equipe.usuarios.push(usuario);
    return this.repositorio.salvar(equipe);
  }

  async removeMembro(projetoId: number, equipeId: number, usuarioId: number): Promise<void> {
    const equipe = await this.repositorio.buscarComUsuarios(projetoId, equipeId);
    if (!equipe) throw new ErroDominio(ErrosEquipe.NAO_ENCONTRADA);

    const tinha = equipe.usuarios.length;
    equipe.usuarios = equipe.usuarios.filter(u => u.id !== usuarioId);

    if (equipe.usuarios.length === tinha) {
      throw new ErroDominio(ErrosEquipe.NAO_ENCONTRADA);
    }

    await this.repositorio.salvar(equipe);
  }

  async findMembros(projetoId: number, equipeId: number): Promise<User[]> {
    const equipe = await this.repositorio.buscarComUsuarios(projetoId, equipeId);
    if (!equipe) throw new ErroDominio(ErrosEquipe.NAO_ENCONTRADA);
    return equipe.usuarios;
  }
}
