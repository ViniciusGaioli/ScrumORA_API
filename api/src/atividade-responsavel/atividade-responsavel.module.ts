import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AtividadeResponsavel } from './entities/atividade-responsavel.entity';
import { Atividade } from '../atividade/entities/atividade.entity';
import { User } from '../users/entities/user.entity';
import { Equipe } from '../equipe/entities/equipe.entity';
import { ProjetoUsuario } from '../projeto_usuario/entities/projeto_usuario.entity';
import { AtividadeResponsavelService } from './atividade-responsavel.service';
import { AtividadeResponsavelAccess } from './atividade-responsavel.access';
import { AtividadeResponsavelController } from './atividade-responsavel.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AtividadeResponsavel, Atividade, User, Equipe, ProjetoUsuario]),
  ],
  controllers: [AtividadeResponsavelController],
  providers: [AtividadeResponsavelService, AtividadeResponsavelAccess],
  exports: [AtividadeResponsavelService],
})
export class AtividadeResponsavelModule {}
