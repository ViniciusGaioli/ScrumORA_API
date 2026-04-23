import { ArrayUnique, IsArray, IsInt, IsOptional, IsPositive, ArrayMinSize } from 'class-validator';

export class CreateAtividadeResponsavelDto {
    @IsInt()
    @IsPositive()
    atividadeId!: number;

    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsInt({ each: true })
    @IsPositive({ each: true })
    usuarioIds?: number[];

    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsInt({ each: true })
    @IsPositive({ each: true })
    equipeIds?: number[];
}