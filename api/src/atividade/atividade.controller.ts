import {Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, HttpCode, Query,} from '@nestjs/common';
import { AtividadeService } from './atividade.service';
import { CreateAtividadeDto } from './dto/create-atividade.dto';
import { UpdateAtividadeDto } from './dto/update-atividade.dto';

@Controller('atividades')
export class AtividadeController {
  constructor(private readonly atividadeService: AtividadeService) {}

  @Post()
  create(@Body() dto: CreateAtividadeDto) {
    return this.atividadeService.create(dto);
  }

  @Get()
  findAll(@Query('projetoId') projetoId?: string) {
    if (projetoId) return this.atividadeService.findByProjeto(Number(projetoId));
    return this.atividadeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.atividadeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAtividadeDto,
  ) {
    return this.atividadeService.update(id, dto);
  }

  @Patch(':id/arquivar')
  arquivar(@Param('id', ParseIntPipe) id: number) {
    return this.atividadeService.arquivar(id);
  }

  @Patch(':id/desarquivar')
  desarquivar(@Param('id', ParseIntPipe) id: number) {
    return this.atividadeService.desarquivar(id);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.atividadeService.remove(id);
  }
}