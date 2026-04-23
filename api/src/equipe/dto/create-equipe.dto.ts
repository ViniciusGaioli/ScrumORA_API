import { IsInt, IsPositive, IsString, Length } from 'class-validator';

export class CreateEquipeDto {
    @IsString()
    @Length(1, 50)
    nome!: string;

    @IsInt()
    @IsPositive()
    projetoId!: number;
}
