import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AtividadeResponsavel } from './entities/atividade-responsavel.entity';
import { Atividade } from '../atividade/entities/atividade.entity';
import { User } from '../users/entities/user.entity';
import { Equipe } from '../equipe/entities/equipe.entity';
import { AtividadeResponsavelService } from './atividade-responsavel.service';
import { AtividadeResponsavelController } from './atividade-responsavel.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AtividadeResponsavel, Atividade, User, Equipe])],
  controllers: [AtividadeResponsavelController],
  providers: [AtividadeResponsavelService],
  exports: [AtividadeResponsavelService],
})
export class AtividadeResponsavelModule {}