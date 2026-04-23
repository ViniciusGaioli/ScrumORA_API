import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { ProjetoUsuario } from '../../projeto_usuario/entities/projeto_usuario.entity';
import { Equipe } from 'src/equipe/entities/equipe.entity';
import { AtividadeResponsavel } from 'src/atividade-responsavel/entities/atividade-responsavel.entity';

@Entity('usuario')
export class User {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'varchar', length: 50 })
    nome!: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email!: string;

    @Column({ type: 'varchar', length: 255, select: false })
    senha!: string;

    @Column({ type: 'varchar', length: 500, nullable: true, name: 'foto_perfil' })
    fotoPerfil?: string;

    @OneToMany(() => ProjetoUsuario, (pu) => pu.usuario)
    projetos!: ProjetoUsuario[];

    @ManyToMany(() => Equipe, (equipe) => equipe.usuarios)
    equipes!: Equipe[];

    @OneToMany(() => AtividadeResponsavel, (ar) => ar.usuario)
    atividadesResponsavel!: AtividadeResponsavel[];
}