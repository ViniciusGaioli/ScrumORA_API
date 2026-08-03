import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipe } from './entities/equipe.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { User } from '../users/entities/user.entity';
import { EquipeService } from './equipe.service';
import { EquipeController } from './equipe.controller';
import { EQUIPE_REPOSITORY } from './equipe.repository';
import { EquipeTypeOrmRepository } from './equipe.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Equipe, Projeto, User])],
  controllers: [EquipeController],
  providers: [
    EquipeService,
    { provide: EQUIPE_REPOSITORY, useClass: EquipeTypeOrmRepository },
  ],
  exports: [EquipeService],
})
export class EquipeModule {}
