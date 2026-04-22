import { IsEnum, IsInt, IsPositive } from 'class-validator';
import { Papel } from '../enums/papel.enum';

export class CreateProjetoUsuarioDto {
    @IsInt()
    @IsPositive()
    usuarioId!: number;

    @IsInt()
    @IsPositive()
    projetoId!: number;

    @IsEnum(Papel)
    papel!: Papel;
}