import { Module } from '@nestjs/common';
import { ENTIDADES } from './data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController} from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProjetoModule } from './projeto/projeto.module';
import { ProjetoUsuarioModule } from './projeto_usuario/projeto_usuario.module';
import { EquipeModule } from './equipe/equipe.module';
import { AtividadeModule } from './atividade/atividade.module';
import { SprintModule } from './sprint/sprint.module';
import { AtividadeResponsavelModule } from './atividade-responsavel/atividade-responsavel.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CommonModule } from './common/common.module';
import { MailModule } from './mail/mail.module';
import { ConviteModule } from './convite/convite.module';

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
        entities: ENTIDADES,
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        migrationsRun: true,
        synchronize: false,
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