import {
  Controller, Get, Post, Body, Param, Patch, Delete,
  ParseIntPipe, HttpCode, UseGuards,
} from '@nestjs/common';
import { SprintService } from './sprint.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { PapelProjetoGuard } from '../common/guards/papel-projeto.guard';
import { PapeisRequeridos } from '../common/decorators/papeis-requeridos.decorator';
import { Papel } from '../projeto_usuario/enums/papel.enum';

@Controller('projetos/:projetoId/sprints')
@UseGuards(PapelProjetoGuard)
export class SprintController {
  constructor(private readonly sprintService: SprintService) {}

  @Post()
  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER)
  create(
    @Param('projetoId', ParseIntPipe) projetoId: number,
    @Body() dto: CreateSprintDto,
  ) {
    return this.sprintService.create(projetoId, dto);
  }

  @Get()
  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER, Papel.DEVELOPER)
  findAll(@Param('projetoId', ParseIntPipe) projetoId: number) {
    return this.sprintService.findAll(projetoId);
  }

  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER, Papel.DEVELOPER)
  @Get(':id')
  findOne(
    @Param('projetoId', ParseIntPipe) projetoId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.sprintService.findOne(projetoId, id);
  }

  @Patch(':id')
  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER)
  update(
    @Param('projetoId', ParseIntPipe) projetoId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSprintDto,
  ) {
    return this.sprintService.update(projetoId, id, dto);
  }

  @Delete(':id')
  @PapeisRequeridos(Papel.PRODUCT_OWNER, Papel.SCRUM_MASTER)
  @HttpCode(204)
  remove(
    @Param('projetoId', ParseIntPipe) projetoId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.sprintService.remove(projetoId, id);
  }
}