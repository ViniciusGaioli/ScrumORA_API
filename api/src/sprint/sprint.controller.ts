import {Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, HttpCode, Query,} from '@nestjs/common';
import { SprintService } from './sprint.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';

@Controller('sprints')
export class SprintController {
  constructor(private readonly sprintService: SprintService) {}

  @Post()
  create(@Body() dto: CreateSprintDto) {
    return this.sprintService.create(dto);
  }

  @Get()
  findAll(@Query('projetoId') projetoId?: string) {
    if (projetoId) return this.sprintService.findByProjeto(Number(projetoId));
    return this.sprintService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sprintService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSprintDto,
  ) {
    return this.sprintService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sprintService.remove(id);
  }
}