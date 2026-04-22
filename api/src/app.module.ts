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
        entities: [User, Projeto, ProjetoUsuario],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: true,
        logging: ['error', 'warn'],
      }),
    }),
    UsersModule,
    ProjetoModule,
    ProjetoUsuarioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}