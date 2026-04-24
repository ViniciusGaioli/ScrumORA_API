import {
  Controller, Get, Post, Body, Param, Patch, Delete,
  ParseIntPipe, HttpCode, UseGuards,
} from '@nestjs/common';
import { EquipeService } from './equipe.service';
import { CreateEquipeDto } from './dto/create-equipe.dto';
import { UpdateEquipeDto } from './dto/update-equipe.dto';
import { PapelProjetoGuard } from '../common/guards/papel-projeto.guard';
import { PapeisRequeridos } from '../common/decorators/papeis-requeridos.decorator';
import { Papel } from '../projeto_usuario/enums/papel.enum';

@Controller('projetos/:projetoId/equipes')
@UseGuards(PapelProjetoGuard)
export class EquipeController {
  constructor(private readonly equipeService: EquipeService) {}

  @Post()
  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER)
  create(
    @Param('projetoId', ParseIntPipe) projetoId: number,
    @Body() dto: CreateEquipeDto,
  ) {
    return this.equipeService.create(projetoId, dto);
  }

  @Get()
  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER, Papel.DEVELOPER)
  findAll(@Param('projetoId', ParseIntPipe) projetoId: number) {
    return this.equipeService.findAll(projetoId);
  }

  @Get(':id')
  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER, Papel.DEVELOPER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.equipeService.findOne(id);
  }

  @Patch(':id')
  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEquipeDto,
  ) {
    return this.equipeService.update(id, dto);
  }

  @Delete(':id')
  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER)
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.equipeService.remove(id);
  }

  @Get(':id/membros')
  findMembros(@Param('id', ParseIntPipe) id: number) {
    return this.equipeService.findMembros(id);
  }

  @Post(':id/membros/:usuarioId')
  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER)
  addMembro(
    @Param('id', ParseIntPipe) id: number,
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    return this.equipeService.addMembro(id, usuarioId);
  }

  @Delete(':id/membros/:usuarioId')
  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER)
  @HttpCode(204)
  removeMembro(
    @Param('id', ParseIntPipe) id: number,
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    return this.equipeService.removeMembro(id, usuarioId);
  }
}