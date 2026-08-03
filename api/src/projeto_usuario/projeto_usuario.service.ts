import { Inject, Injectable } from '@nestjs/common';
import { ErroDominio, ErrosMembro } from '../common';
import { ProjetoUsuario } from './entities/projeto_usuario.entity';
import { CreateProjetoUsuarioDto } from './dto/create-projeto_usuario.dto';
import { UpdateProjetoUsuarioDto } from './dto/update-projeto_usuario.dto';
import {
  PROJETO_USUARIO_REPOSITORY,
  type ProjetoUsuarioRepository,
} from './projeto_usuario.repository';

@Injectable()
export class ProjetoUsuarioService {
  constructor(
    @Inject(PROJETO_USUARIO_REPOSITORY)
    private readonly repositorio: ProjetoUsuarioRepository,
  ) {}

  async create(projetoId: number, dto: CreateProjetoUsuarioDto): Promise<ProjetoUsuario> {
    if (!(await this.repositorio.projetoExiste(projetoId))) {
      throw new ErroDominio(ErrosMembro.NAO_ENCONTRADO);
    }

    if (!(await this.repositorio.usuarioExiste(dto.usuarioId))) {
      throw new ErroDominio(ErrosMembro.NAO_ENCONTRADO);
    }

    const jaExiste = await this.repositorio.buscarVinculo(projetoId, dto.usuarioId);
    if (jaExiste) {
      throw new ErroDominio(ErrosMembro.JA_PARTICIPA);
    }

    return this.repositorio.vincular(projetoId, dto.usuarioId, dto.papel);
  }

  findAllByProjeto(projetoId: number): Promise<ProjetoUsuario[]> {
    return this.repositorio.listarPorProjeto(projetoId);
  }

  async findOne(projetoId: number, usuarioId: number): Promise<ProjetoUsuario> {
    const vinculo = await this.repositorio.buscarVinculo(projetoId, usuarioId);
    if (!vinculo) throw new ErroDominio(ErrosMembro.NAO_ENCONTRADO);
    return vinculo;
  }

  async update(
    projetoId: number,
    usuarioId: number,
    dto: UpdateProjetoUsuarioDto,
  ): Promise<ProjetoUsuario> {
    const vinculo = await this.findOne(projetoId, usuarioId);
    vinculo.papel = dto.papel;
    return this.repositorio.salvar(vinculo);
  }

  async remove(projetoId: number, usuarioId: number): Promise<void> {
    const removeu = await this.repositorio.desvincular(projetoId, usuarioId);
    if (!removeu) throw new ErroDominio(ErrosMembro.NAO_ENCONTRADO);

    await this.repositorio.desatribuirAtividadesDoProjeto(projetoId, usuarioId);
  }
}
