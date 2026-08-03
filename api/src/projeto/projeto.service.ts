import { Inject, Injectable } from '@nestjs/common';
import { ErroDominio, ErrosProjeto } from '../common';
import { Projeto } from './entities/projeto.entity';
import { Etapa } from '../atividade/enums/etapa.enums';
import { StatusSprint } from '../sprint/enums/status-sprint.enum';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import { PROJETO_REPOSITORY, type ProjetoRepository } from './projeto.repository';

function iniciais(nome: string): string {
  const termos = nome.trim().split(/\s+/).filter(Boolean);
  if (termos.length === 0) return '';
  return (termos[0][0] + (termos[1]?.[0] ?? '')).toUpperCase();
}

@Injectable()
export class ProjetoService {
  constructor(
    @Inject(PROJETO_REPOSITORY)
    private readonly repositorio: ProjetoRepository,
  ) {}

  async create(userId: number, dto: CreateProjetoDto): Promise<Projeto> {
    if (!(await this.repositorio.usuarioExiste(userId))) {
      throw new ErroDominio(ErrosProjeto.NAO_ENCONTRADO);
    }

    return this.repositorio.criarComScrumMaster(userId, dto);
  }

  async findByUser(userId: number) {
    const vinculos = await this.repositorio.listarVinculosDoUsuario(userId);

    return vinculos.map(({ projeto, papel }) => {
      const total = projeto.atividades?.length ?? 0;
      const finalizadas = projeto.atividades?.filter(a => a.etapa === Etapa.FINALIZADA).length ?? 0;
      const abertas =
        projeto.atividades?.filter(a => !a.arquivada && a.etapa !== Etapa.FINALIZADA).length ?? 0;
      const progress = total > 0 ? Math.round((finalizadas / total) * 100) : 0;

      const activeSprint = projeto.sprints?.find(s => s.status === StatusSprint.EM_ANDAMENTO);

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
        membros: (projeto.membros ?? []).map(m => ({
          id: m.usuario.id,
          name: m.usuario.nome,
          initials: iniciais(m.usuario.nome),
        })),
      };
    });
  }

  async findOne(id: number): Promise<Projeto> {
    const projeto = await this.repositorio.buscar(id);
    if (!projeto) throw new ErroDominio(ErrosProjeto.NAO_ENCONTRADO);
    return projeto;
  }

  async update(id: number, dto: UpdateProjetoDto): Promise<Projeto> {
    const projeto = await this.findOne(id);
    Object.assign(projeto, dto);
    return this.repositorio.salvar(projeto);
  }

  async remove(id: number): Promise<void> {
    const removeu = await this.repositorio.remover(id);
    if (!removeu) throw new ErroDominio(ErrosProjeto.NAO_ENCONTRADO);
  }
}
