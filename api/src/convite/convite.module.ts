import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Convite } from './entities/convite.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { ProjetoUsuario } from '../projeto_usuario/entities/projeto_usuario.entity';
import { User } from '../users/entities/user.entity';
import { ConviteService } from './convite.service';
import { ConviteController } from './convite.controller';
import { CONVITE_REPOSITORY } from './convite.repository';
import { ConviteTypeOrmRepository } from './convite.typeorm.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Convite, Projeto, ProjetoUsuario, User])],
    providers: [
        ConviteService,
        { provide: CONVITE_REPOSITORY, useClass: ConviteTypeOrmRepository },
    ],
    controllers: [ConviteController],
})
export class ConviteModule {}
