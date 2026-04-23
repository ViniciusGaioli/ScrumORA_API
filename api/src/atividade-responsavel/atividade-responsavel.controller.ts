import {
  Controller, Get, Post, Body, Param, Delete, ParseIntPipe, HttpCode, Query,
} from '@nestjs/common';
import { AtividadeResponsavelService } from './atividade-responsavel.service';
import { CreateAtividadeResponsavelDto } from './dto/create-atividade-responsavel.dto';

@Controller('atividade-responsavel')
export class AtividadeResponsavelController {
  constructor(private readonly service: AtividadeResponsavelService) {}

  @Post()
  create(@Body() dto: CreateAtividadeResponsavelDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query('atividadeId') atividadeId?: string,
    @Query('usuarioId') usuarioId?: string,
    @Query('equipeId') equipeId?: string,
  ) {
    if (atividadeId) return this.service.findByAtividade(Number(atividadeId));
    if (usuarioId) return this.service.findByUsuario(Number(usuarioId));
    if (equipeId) return this.service.findByEquipe(Number(equipeId));
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}