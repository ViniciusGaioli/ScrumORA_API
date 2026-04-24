import {
  Controller, Get, Post, Body, Param, Patch, Delete,
  ParseIntPipe, HttpCode, UseGuards,
} from '@nestjs/common';
import { AtividadeService } from './atividade.service';
import { CreateAtividadeDto } from './dto/create-atividade.dto';
import { UpdateAtividadeDto } from './dto/update-atividade.dto';
import { PapelProjetoGuard } from '../common/guards/papel-projeto.guard';
import { PapeisRequeridos } from '../common/decorators/papeis-requeridos.decorator';
import { Papel } from '../projeto_usuario/enums/papel.enum';

@Controller('projetos/:projetoId/atividades')
@UseGuards(PapelProjetoGuard)
export class AtividadeController {
  constructor(private readonly atividadeService: AtividadeService) {}

  @Post()
  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER)
  create(
    @Param('projetoId', ParseIntPipe) projetoId: number,
    @Body() dto: CreateAtividadeDto,
  ) {
    return this.atividadeService.create(projetoId, dto);
  }
  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER, Papel.DEVELOPER)
  @Get()
  findAll(@Param('projetoId', ParseIntPipe) projetoId: number) {
    return this.atividadeService.findAll(projetoId);
  }

  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER, Papel.DEVELOPER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.atividadeService.findOne(id);
  }

  @Patch(':id')
  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAtividadeDto,
  ) {
    return this.atividadeService.update(id, dto);
  }

  @Patch(':id/arquivar')
  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER)
  arquivar(@Param('id', ParseIntPipe) id: number) {
    return this.atividadeService.arquivar(id);
  }

  @Patch(':id/desarquivar')
  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER)
  desarquivar(@Param('id', ParseIntPipe) id: number) {
    return this.atividadeService.desarquivar(id);
  }

  @Delete(':id')
  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER)
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.atividadeService.remove(id);
  }
}