import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjetoUsuario } from './entities/projeto_usuario.entity';
import { User } from '../users/entities/user.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { AtividadeResponsavel } from '../atividade-responsavel/entities/atividade-responsavel.entity';
import { ProjetoUsuarioService } from './projeto_usuario.service';
import { ProjetoUsuarioController } from './projeto_usuario.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProjetoUsuario, User, Projeto, AtividadeResponsavel])],
  controllers: [ProjetoUsuarioController],
  providers: [ProjetoUsuarioService],
  exports: [ProjetoUsuarioService],
})
export class ProjetoUsuarioModule {}