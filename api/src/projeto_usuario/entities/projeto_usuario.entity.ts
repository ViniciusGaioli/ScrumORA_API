import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique,} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Projeto } from '../../projeto/entities/projeto.entity';
import { Papel } from '../enums/papel.enum';

@Entity('projeto_usuario')
@Unique(['usuario', 'projeto']) 
export class ProjetoUsuario {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @ManyToOne(() => User, (user) => user.projetos, {
        onDelete: 'CASCADE',
        nullable: false,
    })
    @JoinColumn({ name: 'usuario_id' })
    usuario!: User;

    @ManyToOne(() => Projeto, (projeto) => projeto.membros, {
            onDelete: 'CASCADE',
            nullable: false,
    })
    @JoinColumn({ name: 'projeto_id' })
    projeto!: Projeto;

    @Column({ type: 'enum', enum: Papel })
    papel!: Papel;
}