import { IsEmail, IsOptional, IsString, IsUrl, Length, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @Length(1, 50)
    nome!: string;

    @IsEmail()
    @Length(1, 255)
    email!: string;

    @IsString()
    @MinLength(8)
    senha!: string;

    @IsOptional()
    @IsUrl()
    fotoPerfil?: string;
}

