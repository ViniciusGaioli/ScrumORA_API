import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projeto } from './entities/projeto.entity';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';

@Injectable()
export class ProjetoService {
  constructor(
    @InjectRepository(Projeto)
    private readonly projetoRepo: Repository<Projeto>,
  ) {}

  create(dto: CreateProjetoDto): Promise<Projeto> {
    const projeto = this.projetoRepo.create(dto);
    return this.projetoRepo.save(projeto);
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