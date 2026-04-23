import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipe } from './entities/equipe.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { EquipeService } from './equipe.service';
import { EquipeController } from './equipe.controller';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Equipe, Projeto, User])],
  controllers: [EquipeController],
  providers: [EquipeService],
  exports: [EquipeService],
})
export class EquipeModule {}