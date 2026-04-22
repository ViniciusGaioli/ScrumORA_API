import { IsEnum } from 'class-validator';
import { Papel } from '../enums/papel.enum';

export class UpdateProjetoUsuarioDto {
    @IsEnum(Papel)
    papel!: Papel;
}