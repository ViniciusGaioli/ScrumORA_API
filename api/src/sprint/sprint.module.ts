import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sprint } from './entities/sprint.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { SprintService } from './sprint.service';
import { SprintController } from './sprint.controller';
import { SPRINT_REPOSITORY } from './sprint.repository';
import { SprintTypeOrmRepository } from './sprint.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Sprint, Projeto])],
  controllers: [SprintController],
  providers: [
    SprintService,
    { provide: SPRINT_REPOSITORY, useClass: SprintTypeOrmRepository },
  ],
  exports: [SprintService],
})
export class SprintModule {}
