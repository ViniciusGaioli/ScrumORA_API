import { IsDateString, IsEnum, IsInt, IsOptional, IsPositive, IsString, Length } from 'class-validator';
import { StatusSprint } from '../enums/status-sprint.enum';

export class CreateSprintDto {
    @IsString()
    @Length(1, 50)
    nome!: string;

    @IsDateString()
    dataInicio!: string;

    @IsDateString()
    dataFim!: string;

    @IsOptional()
    @IsEnum(StatusSprint)
    status?: StatusSprint;

    @IsInt()
    @IsPositive()
    projetoId!: number;
}
