import { ErroDominio, ErrosAuth } from '../common';
import { Injectable } from '@nestjs/common';
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
      throw new ErroDominio(ErrosAuth.CREDENCIAIS_INVALIDAS);
    }

    if (!user.senha) {
      throw new ErroDominio(ErrosAuth.CREDENCIAIS_INVALIDAS);
    }

    const senhaConfere = await bcrypt.compare(dto.senha, user.senha);
    if (!senhaConfere) {
      throw new ErroDominio(ErrosAuth.CREDENCIAIS_INVALIDAS);
    }

    if (!user.emailVerificado) {
      throw new ErroDominio(ErrosAuth.EMAIL_NAO_VERIFICADO);
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