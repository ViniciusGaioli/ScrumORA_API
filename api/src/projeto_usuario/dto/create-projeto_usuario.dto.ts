import { IsEnum, IsInt, IsPositive } from 'class-validator';
import { Papel } from '../enums/papel.enum';

export class CreateProjetoUsuarioDto {
    @IsInt()
    @IsPositive()
    usuarioId!: number;

    @IsEnum(Papel)
    papel!: Papel;
}