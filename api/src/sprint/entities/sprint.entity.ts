import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn,} from 'typeorm';
import { Projeto } from '../../projeto/entities/projeto.entity';
import { Atividade } from '../../atividade/entities/atividade.entity';
import { StatusSprint } from '../enums/status-sprint.enum';

@Entity('sprint')
export class Sprint {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'varchar', length: 50 })
    nome!: string;

    @Column({ type: 'date', name: 'data_inicio' })
    dataInicio!: Date;

    @Column({ type: 'date', name: 'data_fim' })
    dataFim!: Date;

    @Column({ type: 'enum', enum: StatusSprint, default: StatusSprint.PLANEJADA })
    status!: StatusSprint;

    @ManyToOne(() => Projeto, (projeto) => projeto.sprints, {
        onDelete: 'CASCADE',
        nullable: false,
    })
    @JoinColumn({ name: 'projeto_id' })
    projeto!: Projeto;

    @OneToMany(() => Atividade, (atividade) => atividade.sprint)
    atividades!: Atividade[];
}