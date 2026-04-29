import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Convite } from './entities/convite.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { ProjetoUsuario } from '../projeto_usuario/entities/projeto_usuario.entity';
import { User } from '../users/entities/user.entity';
import { ConviteService } from './convite.service';
import { ConviteController } from './convite.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Convite, Projeto, ProjetoUsuario, User])],
    providers: [ConviteService],
    controllers: [ConviteController],
})
export class ConviteModule {}
