import {
  Injectable, NotFoundException, BadRequestException, ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { AtividadeResponsavel } from './entities/atividade-responsavel.entity';
import { Atividade } from '../atividade/entities/atividade.entity';
import { User } from '../users/entities/user.entity';
import { Equipe } from '../equipe/entities/equipe.entity';
import { CreateAtividadeResponsavelDto } from './dto/create-atividade-responsavel.dto';

@Injectable()
export class AtividadeResponsavelService {
  constructor(
    @InjectRepository(AtividadeResponsavel)
    private readonly arRepo: Repository<AtividadeResponsavel>,
    @InjectRepository(Atividade)
    private readonly atividadeRepo: Repository<Atividade>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Equipe)
    private readonly equipeRepo: Repository<Equipe>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateAtividadeResponsavelDto): Promise<AtividadeResponsavel[]> {
    const usuarioIds = dto.usuarioIds ?? [];
    const equipeIds = dto.equipeIds ?? [];

    if (usuarioIds.length === 0 && equipeIds.length === 0) {
      throw new BadRequestException(
        'Informe pelo menos um responsável (usuarioIds ou equipeIds)',
      );
    }

    const atividade = await this.atividadeRepo.findOne({ where: { id: dto.atividadeId } });
    if (!atividade) {
      throw new NotFoundException(`Atividade ${dto.atividadeId} não encontrada`);
    }

    let usuarios: User[] = [];
    if (usuarioIds.length > 0) {
      usuarios = await this.userRepo.find({ where: { id: In(usuarioIds) } });
      if (usuarios.length !== usuarioIds.length) {
        const encontrados = usuarios.map((u) => u.id);
        const faltando = usuarioIds.filter((id) => !encontrados.includes(id));
        throw new NotFoundException(`Usuários não encontrados: ${faltando.join(', ')}`);
      }
    }

    let equipes: Equipe[] = [];
    if (equipeIds.length > 0) {
      equipes = await this.equipeRepo.find({ where: { id: In(equipeIds) } });
      if (equipes.length !== equipeIds.length) {
        const encontrados = equipes.map((e) => e.id);
        const faltando = equipeIds.filter((id) => !encontrados.includes(id));
        throw new NotFoundException(`Equipes não encontradas: ${faltando.join(', ')}`);
      }
    }
    const jaExistentes = await this.arRepo.find({
      where: { atividade: { id: dto.atividadeId } },
      relations: ['usuario', 'equipe'],
    });

    const usuariosJa = jaExistentes.filter((r) => r.usuario).map((r) => r.usuario!.id);
    const equipesJa = jaExistentes.filter((r) => r.equipe).map((r) => r.equipe!.id);

    const usuariosDuplicados = usuarioIds.filter((id) => usuariosJa.includes(id));
    const equipesDuplicadas = equipeIds.filter((id) => equipesJa.includes(id));

    if (usuariosDuplicados.length > 0 || equipesDuplicadas.length > 0) {
      const msgs: string[] = [];
      if (usuariosDuplicados.length > 0) {
        msgs.push(`usuários já responsáveis: ${usuariosDuplicados.join(', ')}`);
      }
      if (equipesDuplicadas.length > 0) {
        msgs.push(`equipes já responsáveis: ${equipesDuplicadas.join(', ')}`);
      }
      throw new ConflictException(msgs.join('; '));
    }

    const novos: AtividadeResponsavel[] = [
      ...usuarios.map((u) => this.arRepo.create({ atividade, usuario: u })),
      ...equipes.map((e) => this.arRepo.create({ atividade, equipe: e })),
    ];

    return this.dataSource.transaction(async (manager) => {
      return manager.save(AtividadeResponsavel, novos);
    });
  }

  findAll(): Promise<AtividadeResponsavel[]> {
    return this.arRepo.find({ relations: ['atividade', 'usuario', 'equipe'] });
  }

  async findOne(id: number): Promise<AtividadeResponsavel> {
    const ar = await this.arRepo.findOne({
      where: { id },
      relations: ['atividade', 'usuario', 'equipe'],
    });
    if (!ar) throw new NotFoundException(`Responsabilidade ${id} não encontrada`);
    return ar;
  }

  findByAtividade(atividadeId: number): Promise<AtividadeResponsavel[]> {
    return this.arRepo.find({
      where: { atividade: { id: atividadeId } },
      relations: ['usuario', 'equipe'],
    });
  }

  findByUsuario(usuarioId: number): Promise<AtividadeResponsavel[]> {
    return this.arRepo.find({
      where: { usuario: { id: usuarioId } },
      relations: ['atividade'],
    });
  }

  findByEquipe(equipeId: number): Promise<AtividadeResponsavel[]> {
    return this.arRepo.find({
      where: { equipe: { id: equipeId } },
      relations: ['atividade'],
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.arRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Responsabilidade ${id} não encontrada`);
    }
  }
}