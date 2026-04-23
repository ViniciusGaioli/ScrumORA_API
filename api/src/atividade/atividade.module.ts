import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Atividade } from './entities/atividade.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { AtividadeService } from './atividade.service';
import { AtividadeController } from './atividade.controller';
import { Sprint } from 'src/sprint/entities/sprint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Atividade, Projeto, Sprint])],
  controllers: [AtividadeController],
  providers: [AtividadeService],
  exports: [AtividadeService],
})
export class AtividadeModule {}