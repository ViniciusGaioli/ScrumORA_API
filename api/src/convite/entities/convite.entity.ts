import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Projeto } from '../../projeto/entities/projeto.entity';
import { Papel } from '../../projeto_usuario/enums/papel.enum';

@Entity('convite')
export class Convite {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'varchar', length: 36, unique: true })
    token!: string;

    @ManyToOne(() => Projeto, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'projeto_id' })
    projeto!: Projeto;

    @Column({ type: 'varchar', length: 255, nullable: true })
    email!: string | null;

    @Column({ type: 'enum', enum: Papel, default: Papel.DEVELOPER })
    papel!: Papel;

    @Column({ type: 'datetime', name: 'expires_at' })
    expiresAt!: Date;

    @Column({ type: 'datetime', name: 'usado_em', nullable: true })
    usadoEm!: Date | null;
}
