import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, HttpCode, Query } from '@nestjs/common';
import { AtividadeResponsavelService } from './atividade-responsavel.service';
import { AtividadeResponsavelAccess } from './atividade-responsavel.access';
import { CreateAtividadeResponsavelDto } from './dto/create-atividade-responsavel.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { UsuarioAtual } from '../common/decorators/current-user.decorator';
import { Mensagem } from '../common';

@Controller('atividade-responsavel')
export class AtividadeResponsavelController {
  constructor(
    private readonly service: AtividadeResponsavelService,
    private readonly access: AtividadeResponsavelAccess,
  ) {}

  @Post()
  @Mensagem('Responsáveis vinculados.')
  async create(@CurrentUser() user: UsuarioAtual, @Body() dto: CreateAtividadeResponsavelDto) {
    await this.access.porAtividade(user.id, dto.atividadeId);
    return this.service.create(dto);
  }

  @Get()
  @Mensagem('Responsáveis carregados.')
  async findAll(
    @CurrentUser() user: UsuarioAtual,
    @Query('atividadeId', ParseIntPipe) atividadeId: number,
  ) {
    await this.access.porAtividade(user.id, atividadeId);
    return this.service.findByAtividade(atividadeId);
  }

  @Get(':id')
  @Mensagem('Responsável carregado.')
  async findOne(@CurrentUser() user: UsuarioAtual, @Param('id', ParseIntPipe) id: number) {
    await this.access.porVinculo(user.id, id);
    return this.service.findOne(id);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@CurrentUser() user: UsuarioAtual, @Param('id', ParseIntPipe) id: number) {
    await this.access.porVinculo(user.id, id);
    return this.service.remove(id);
  }
}
