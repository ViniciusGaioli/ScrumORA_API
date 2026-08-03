import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Atividade } from './entities/atividade.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { Sprint } from '../sprint/entities/sprint.entity';
import { AtividadeService } from './atividade.service';
import { AtividadeController } from './atividade.controller';
import { ATIVIDADE_REPOSITORY } from './atividade.repository';
import { AtividadeTypeOrmRepository } from './atividade.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Atividade, Projeto, Sprint])],
  controllers: [AtividadeController],
  providers: [
    AtividadeService,
    { provide: ATIVIDADE_REPOSITORY, useClass: AtividadeTypeOrmRepository },
  ],
  exports: [AtividadeService],
})
export class AtividadeModule {}
