import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjetoUsuario } from '../projeto_usuario/entities/projeto_usuario.entity';
import { PapelProjetoGuard } from './guards/papel-projeto.guard';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([ProjetoUsuario])],
    providers: [PapelProjetoGuard],
    exports: [PapelProjetoGuard, TypeOrmModule],
})
export class CommonModule {}