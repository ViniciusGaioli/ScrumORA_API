import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProjetoUsuario } from '../../projeto_usuario/entities/projeto_usuario.entity';
import { Equipe } from 'src/equipe/entities/equipe.entity';
import { Atividade } from 'src/atividade/entities/atividade.entity';
import { Sprint } from 'src/sprint/entities/sprint.entity';

@Entity('projeto')
export class Projeto {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'varchar', length: 50 })
    nome!: string;

    @Column({ type: 'varchar', length: 255 })
    descricao!: string;

    @OneToMany(() => ProjetoUsuario, (pu) => pu.projeto)
    membros!: ProjetoUsuario[];

    @OneToMany(() => Equipe, (equipe) => equipe.projeto)
    equipes!: Equipe[];

    @OneToMany(() => Atividade, (atividade) => atividade.projeto)
    atividades!: Atividade[];

    @OneToMany(() => Sprint, (sprint) => sprint.projeto)
    sprints!: Sprint[];
}