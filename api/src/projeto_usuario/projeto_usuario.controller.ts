import {
  Controller, Get, Post, Body, Param, Patch, Delete,
  ParseIntPipe, HttpCode, UseGuards,
} from '@nestjs/common';
import { ProjetoUsuarioService } from './projeto_usuario.service';
import { CreateProjetoUsuarioDto } from './dto/create-projeto_usuario.dto';
import { UpdateProjetoUsuarioDto } from './dto/update-projeto_usuario.dto';
import { PapelProjetoGuard } from '../common/guards/papel-projeto.guard';
import { PapeisRequeridos } from '../common/decorators/papeis-requeridos.decorator';
import { Papel } from './enums/papel.enum';

@Controller('projetos/:projetoId/membros')
@UseGuards(PapelProjetoGuard)
export class ProjetoUsuarioController {
  constructor(private readonly service: ProjetoUsuarioService) {}

  @Post()
  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER)
  create(
    @Param('projetoId', ParseIntPipe) projetoId: number,
    @Body() dto: CreateProjetoUsuarioDto,
  ) {
    return this.service.create(projetoId, dto);
  }

  @Get()
  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER, Papel.DEVELOPER)
  findAll(@Param('projetoId', ParseIntPipe) projetoId: number) {
    return this.service.findAllByProjeto(projetoId);
  }

  @Get(':usuarioId')
  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER, Papel.DEVELOPER)
  findOne(
    @Param('projetoId', ParseIntPipe) projetoId: number,
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    return this.service.findOne(projetoId, usuarioId);
  }

  @Patch(':usuarioId')
  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER)
  update(
    @Param('projetoId', ParseIntPipe) projetoId: number,
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Body() dto: UpdateProjetoUsuarioDto,
  ) {
    return this.service.update(projetoId, usuarioId, dto);
  }

  @Delete(':usuarioId')
  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER)
  @HttpCode(204)
  remove(
    @Param('projetoId', ParseIntPipe) projetoId: number,
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    return this.service.remove(projetoId, usuarioId);
  }
}