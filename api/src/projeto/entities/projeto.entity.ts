import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProjetoUsuario } from '../../projeto_usuario/entities/projeto_usuario.entity';

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
}