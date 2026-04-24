import {IsBoolean, IsDateString, IsEnum, IsInt, IsOptional, IsPositive, IsString, Length,} from 'class-validator';
import { Etapa } from '../enums/etapa.enums';

export class CreateAtividadeDto {
    @IsString()
    @Length(1, 50)
    nome!: string;

    @IsString()
    @Length(1, 255)
    descricao!: string;

    @IsDateString()
    dataInicio!: string;

    @IsDateString()
    dataFim!: string;

    @IsOptional()
    @IsEnum(Etapa)
    etapa?: Etapa;

    @IsOptional()
    @IsBoolean()
    arquivada?: boolean;

    @IsOptional()
    @IsInt()
    @IsPositive()
    sprintId?: number;
}
