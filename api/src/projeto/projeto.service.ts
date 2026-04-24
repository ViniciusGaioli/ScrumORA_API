import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Projeto } from './entities/projeto.entity';
import { ProjetoUsuario } from '../projeto_usuario/entities/projeto_usuario.entity';
import { User } from '../users/entities/user.entity';
import { Papel } from '../projeto_usuario/enums/papel.enum';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';

@Injectable()
export class ProjetoService {
  constructor(
    @InjectRepository(Projeto)
    private readonly projetoRepo: Repository<Projeto>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async create(userId: number, dto: CreateProjetoDto): Promise<Projeto> {
    const criador = await this.userRepo.findOne({ where: { id: userId } });
    if (!criador) {
      throw new NotFoundException(`Usuário ${userId} não encontrado`);
    }

    return this.dataSource.transaction(async (manager) => {
      const projeto = manager.create(Projeto, dto);
      const projetoSalvo = await manager.save(projeto);

      const vinculo = manager.create(ProjetoUsuario, {
        usuario: criador,
        projeto: projetoSalvo,
        papel: Papel.SCRUM_MASTER,
      });
      await manager.save(vinculo);
      return projetoSalvo;
    });
  }

  findAll(): Promise<Projeto[]> {
    return this.projetoRepo.find();
  }

  async findOne(id: number): Promise<Projeto> {
    const projeto = await this.projetoRepo.findOne({ where: { id } });
    if (!projeto) throw new NotFoundException(`Projeto ${id} não encontrado`);
    return projeto;
  }

  async update(id: number, dto: UpdateProjetoDto): Promise<Projeto> {
    const projeto = await this.findOne(id);
    Object.assign(projeto, dto);
    return this.projetoRepo.save(projeto);
  }

  async remove(id: number): Promise<void> {
    const result = await this.projetoRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Projeto ${id} não encontrado`);
    }
  }
}