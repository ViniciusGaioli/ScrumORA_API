import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Projeto } from './projeto/entities/projeto.entity';
import { ProjetoUsuario } from './projeto_usuario/entities/projeto_usuario.entity';
import { Equipe } from './equipe/entities/equipe.entity';
import { Atividade } from './atividade/entities/atividade.entity';
import { Sprint } from './sprint/entities/sprint.entity';
import { AtividadeResponsavel } from './atividade-responsavel/entities/atividade-responsavel.entity';
import { Convite } from './convite/entities/convite.entity';

export const ENTIDADES = [
  User,
  Projeto,
  ProjetoUsuario,
  Equipe,
  Atividade,
  Sprint,
  AtividadeResponsavel,
  Convite,
];

export default new DataSource({
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ENTIDADES,
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  synchronize: false,
});
