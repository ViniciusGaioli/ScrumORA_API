import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany,} from 'typeorm';
import { Projeto } from '../../projeto/entities/projeto.entity';
import { Etapa } from '../enums/etapa.enums';
import { Sprint } from 'src/sprint/entities/sprint.entity';
import { AtividadeResponsavel } from 'src/atividade-responsavel/entities/atividade-responsavel.entity';
@Entity('atividade')
export class Atividade {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'varchar', length: 50 })
    nome!: string;

    @Column({ type: 'varchar', length: 255 })
    descricao!: string;

    @Column({ type: 'date', name: 'data_inicio' })
    dataInicio!: Date;

    @Column({ type: 'date', name: 'data_fim' })
    dataFim!: Date;

    @Column({ type: 'enum', enum: Etapa, default: Etapa.BACKLOG })
        etapa!: Etapa;

    @Column({ type: 'boolean', default: false })
    arquivada!: boolean;

    @ManyToOne(() => Projeto, (projeto) => projeto.atividades, {
        onDelete: 'CASCADE',
        nullable: false,
    })
    @JoinColumn({ name: 'projeto_id' })
    projeto!: Projeto;

    @ManyToOne(() => Sprint, (sprint) => sprint.atividades, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn({ name: 'sprint_id' })
    sprint?: Sprint;

    @OneToMany(() => AtividadeResponsavel, (ar) => ar.atividade)
    responsaveis!: AtividadeResponsavel[];
}