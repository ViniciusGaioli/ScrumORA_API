import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user) {
      throw new NotFoundException('Nenhuma conta encontrada com este e-mail.');
    }

    if (!user.senha) {
      throw new UnauthorizedException('Esta conta foi criada com Google. Use o botão "Entrar com Google".');
    }

    const senhaConfere = await bcrypt.compare(dto.senha, user.senha);
    if (!senhaConfere) {
      throw new UnauthorizedException('Senha incorreta.');
    }

    if (!user.emailVerificado) {
      throw new ForbiddenException(
        'Email não verificado. Verifique sua caixa de entrada e Spam.',
      );
    }

    const payload = { sub: user.id, email: user.email, nome: user.nome };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
      },
    };
  }

  async register(dto: CreateUserDto) {
    await this.usersService.create(dto);
    return { message: 'Conta criada! Verifique seu email para ativar sua conta.' };
  }

  async loginWithGoogle(user: User) {
    const payload = { sub: user.id, email: user.email, nome: user.nome };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, user: { id: user.id, nome: user.nome, email: user.email } };
  }
}