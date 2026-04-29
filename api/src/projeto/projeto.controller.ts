import {
  Controller, Get, Post, Body, Param, Patch, Delete,
  ParseIntPipe, HttpCode, UseGuards,
} from '@nestjs/common';
import { ProjetoService } from './projeto.service';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import { PapelProjetoGuard } from '../common/guards/papel-projeto.guard';
import { PapeisRequeridos } from '../common/decorators/papeis-requeridos.decorator';
import { Papel } from '../projeto_usuario/enums/papel.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { UsuarioAtual } from '../common/decorators/current-user.decorator';

@Controller('projetos')
export class ProjetoController {
  constructor(private readonly projetoService: ProjetoService) {}

  @Post()
  create(
    @CurrentUser() user: UsuarioAtual,
    @Body() dto: CreateProjetoDto,
  ) {
    return this.projetoService.create(user.id, dto);
  }

  @Get()
  findAll() {
    return this.projetoService.findAll();
  }

  @Get('me')
  findMy(@CurrentUser() user: UsuarioAtual) {
    return this.projetoService.findByUser(user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projetoService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(PapelProjetoGuard)
  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjetoDto,
  ) {
    return this.projetoService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(PapelProjetoGuard)
  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER)
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projetoService.remove(id);
  }
}