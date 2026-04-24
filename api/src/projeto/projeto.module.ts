import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projeto } from './entities/projeto.entity';
import { User } from '../users/entities/user.entity';
import { ProjetoService } from './projeto.service';
import { ProjetoController } from './projeto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Projeto, User])],
  controllers: [ProjetoController],
  providers: [ProjetoService],
  exports: [ProjetoService],
})
export class ProjetoModule {}