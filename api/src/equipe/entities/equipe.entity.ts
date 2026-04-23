import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToMany,} from 'typeorm';
import { Projeto } from '../../projeto/entities/projeto.entity';
import { User } from 'src/users/entities/user.entity';
import { AtividadeResponsavel } from 'src/atividade-responsavel/entities/atividade-responsavel.entity';

@Entity('equipe')
export class Equipe {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'varchar', length: 50 })
    nome!: string;

    @ManyToOne(() => Projeto, (projeto) => projeto.equipes, {
        onDelete: 'CASCADE',
        nullable: false,
    })
    @JoinColumn({ name: 'projeto_id' })
    projeto!: Projeto;

    @ManyToMany(() => User, (user) => user.equipes)
    @JoinTable({
        name: 'equipe_usuario',
        joinColumn: { name: 'equipe_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'usuario_id', referencedColumnName: 'id' },
    })
    usuarios!: User[];

    @OneToMany(() => AtividadeResponsavel, (ar) => ar.equipe)
    atividadesResponsavel!: AtividadeResponsavel[];
}