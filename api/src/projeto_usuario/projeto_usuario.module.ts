import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjetoUsuario } from './entities/projeto_usuario.entity';
import { User } from '../users/entities/user.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { AtividadeResponsavel } from '../atividade-responsavel/entities/atividade-responsavel.entity';
import { ProjetoUsuarioService } from './projeto_usuario.service';
import { ProjetoUsuarioController } from './projeto_usuario.controller';
import { PROJETO_USUARIO_REPOSITORY } from './projeto_usuario.repository';
import { ProjetoUsuarioTypeOrmRepository } from './projeto_usuario.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProjetoUsuario, User, Projeto, AtividadeResponsavel])],
  controllers: [ProjetoUsuarioController],
  providers: [
    ProjetoUsuarioService,
    { provide: PROJETO_USUARIO_REPOSITORY, useClass: ProjetoUsuarioTypeOrmRepository },
  ],
  exports: [ProjetoUsuarioService],
})
export class ProjetoUsuarioModule {}
