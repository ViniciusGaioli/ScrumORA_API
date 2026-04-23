import {Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Check,} from 'typeorm';
import { Atividade } from '../../atividade/entities/atividade.entity';
import { User } from '../../users/entities/user.entity';
import { Equipe } from '../../equipe/entities/equipe.entity';

@Entity('atividade_responsavel')
@Check(`
    (usuario_id IS NOT NULL AND equipe_id IS NULL) OR
    (usuario_id IS NULL AND equipe_id IS NOT NULL)
`)
export class AtividadeResponsavel {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @ManyToOne(() => Atividade, (atividade) => atividade.responsaveis, {
        onDelete: 'CASCADE',
        nullable: false,
    })
    @JoinColumn({ name: 'atividade_id' })
    atividade!: Atividade;

    @ManyToOne(() => User, (user) => user.atividadesResponsavel, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn({ name: 'usuario_id' })
    usuario?: User | null;

    @ManyToOne(() => Equipe, (equipe) => equipe.atividadesResponsavel, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn({ name: 'equipe_id' })
    equipe?: Equipe | null;
}