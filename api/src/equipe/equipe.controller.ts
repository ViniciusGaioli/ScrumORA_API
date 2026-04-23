import {Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, HttpCode, Query,} from '@nestjs/common';
import { EquipeService } from './equipe.service';
import { CreateEquipeDto } from './dto/create-equipe.dto';
import { UpdateEquipeDto } from './dto/update-equipe.dto';

@Controller('equipes')
export class EquipeController {
  constructor(private readonly equipeService: EquipeService) {}

  @Post()
  create(@Body() dto: CreateEquipeDto) {
    return this.equipeService.create(dto);
  }

  @Get()
  findAll(@Query('projetoId') projetoId?: string) {
    if (projetoId) return this.equipeService.findByProjeto(Number(projetoId));
    return this.equipeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.equipeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEquipeDto,
  ) {
    return this.equipeService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.equipeService.remove(id);
  }

  @Get(':id/membros')
  findMembros(@Param('id', ParseIntPipe) id: number) {
    return this.equipeService.findMembros(id);
  }

  @Post(':id/membros/:usuarioId')
  addMembro(
    @Param('id', ParseIntPipe) id: number,
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    return this.equipeService.addMembro(id, usuarioId);
  }
  
  @Delete(':id/membros/:usuarioId')
  @HttpCode(204)
  removeMembro(
    @Param('id', ParseIntPipe) id: number,
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    return this.equipeService.removeMembro(id, usuarioId);
  }
}