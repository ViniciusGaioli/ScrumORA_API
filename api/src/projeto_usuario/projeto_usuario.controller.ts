import {Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, HttpCode, Query,} from '@nestjs/common';
import { ProjetoUsuarioService } from './projeto_usuario.service';
import { CreateProjetoUsuarioDto } from './dto/create-projeto_usuario.dto';
import { UpdateProjetoUsuarioDto } from './dto/update-projeto_usuario.dto';

@Controller('projeto-usuarios')
export class ProjetoUsuarioController {
  constructor(private readonly service: ProjetoUsuarioService) {}

  @Post()
  create(@Body() dto: CreateProjetoUsuarioDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query('projetoId') projetoId?: string,
    @Query('usuarioId') usuarioId?: string,
  ) {
    if (projetoId) return this.service.findByProjeto(Number(projetoId));
    if (usuarioId) return this.service.findByUsuario(Number(usuarioId));
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjetoUsuarioDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}