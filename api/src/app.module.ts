import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController} from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProjetoModule } from './projeto/projeto.module';
import { User } from './users/entities/user.entity';
import { Projeto } from './projeto/entities/projeto.entity';
import { ProjetoUsuarioModule } from './projeto_usuario/projeto_usuario.module';
import { ProjetoUsuario } from './projeto_usuario/entities/projeto_usuario.entity';
import { EquipeModule } from './equipe/equipe.module';
import { Equipe } from './equipe/entities/equipe.entity';
import { AtividadeModule } from './atividade/atividade.module';
import { Atividade } from './atividade/entities/atividade.entity';
import { SprintModule } from './sprint/sprint.module';
import { Sprint } from './sprint/entities/sprint.entity';
import { AtividadeResponsavelModule } from './atividade-responsavel/atividade-responsavel.module';
import { AtividadeResponsavel } from './atividade-responsavel/entities/atividade-responsavel.entity';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CommonModule } from './common/common.module';
import { MailModule } from './mail/mail.module';
import { ConviteModule } from './convite/convite.module';
import { Convite } from './convite/entities/convite.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mariadb',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [User, Projeto, ProjetoUsuario, Equipe, Atividade, Sprint, AtividadeResponsavel, Convite],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: true,
        logging: ['error', 'warn'],
      }),
    }),
    UsersModule,
    ProjetoModule,
    ProjetoUsuarioModule,
    EquipeModule,
    AtividadeModule,
    SprintModule,
    AtividadeResponsavelModule,
    AuthModule,
    CommonModule,
    MailModule,
    ConviteModule,
  ],
  controllers: [AppController],
  providers: [AppService, {provide: APP_GUARD, useClass: JwtAuthGuard}],
})
export class AppModule {}