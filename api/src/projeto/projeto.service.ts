import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Projeto } from './entities/projeto.entity';
import { ProjetoUsuario } from '../projeto_usuario/entities/projeto_usuario.entity';
import { User } from '../users/entities/user.entity';
import { Papel } from '../projeto_usuario/enums/papel.enum';
import { Etapa } from '../atividade/enums/etapa.enums';
import { StatusSprint } from '../sprint/enums/status-sprint.enum';
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

  async findByUser(userId: number) {
    const vinculos = await this.dataSource
      .getRepository(ProjetoUsuario)
      .find({
        where: { usuario: { id: userId } },
        relations: [
          'projeto',
          'projeto.membros',
          'projeto.membros.usuario',
          'projeto.sprints',
          'projeto.atividades',
        ],
      });

    return vinculos.map(({ projeto, papel }) => {
      const total = projeto.atividades?.length ?? 0;
      const finalizadas = projeto.atividades?.filter(a => a.etapa === Etapa.FINALIZADA).length ?? 0;
      const abertas = projeto.atividades?.filter(a => !a.arquivada && a.etapa !== Etapa.FINALIZADA).length ?? 0;
      const progress = total > 0 ? Math.round((finalizadas / total) * 100) : 0;

      const activeSprint = projeto.sprints?.find(s => s.status === StatusSprint.EM_ANDAMENTO);

      const membros = (projeto.membros ?? []).map(m => {
        const words = m.usuario.nome.trim().split(/\s+/);
        const initials = (words[0][0] + (words[1]?.[0] ?? '')).toUpperCase();
        return { id: m.usuario.id, name: m.usuario.nome, initials };
      });

      return {
        id: projeto.id,
        nome: projeto.nome,
        descricao: projeto.descricao,
        papel,
        progress,
        atividadesAbertas: abertas,
        activeSprint: activeSprint
          ? { id: activeSprint.id, nome: activeSprint.nome, ativa: true }
          : undefined,
        membros,
      };
    });
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