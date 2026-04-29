import { IsEmail, IsOptional } from 'class-validator';

export class CriarConviteDto {
    @IsOptional()
    @IsEmail()
    email?: string;
}
