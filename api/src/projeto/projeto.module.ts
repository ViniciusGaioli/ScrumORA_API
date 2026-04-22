import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projeto } from './entities/projeto.entity';
import { ProjetoService } from './projeto.service';
import { ProjetoController } from './projeto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Projeto])],
  controllers: [ProjetoController],
  providers: [ProjetoService],
  exports: [ProjetoService],
})
export class ProjetoModule {}