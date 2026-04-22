import { IsString, Length } from 'class-validator';

export class CreateProjetoDto {
    @IsString()
    @Length(1, 50)
    nome!: string;

    @IsString()
    @Length(1, 255)
    descricao!: string;
}