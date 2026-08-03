import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthRedirectService } from './auth-redirect.service';
import { LoginDto } from './dto/login';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { Mensagem, Public } from '../common';
import { GoogleLoginGuard } from './guards/google-login.guard';
import { GoogleRegisterGuard } from './guards/google-register.guard';
import { GoogleCallbackGuard } from './guards/google-callback.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly redirect: AuthRedirectService,
  ) {}

  @Public()
  @Post('login')
  @Mensagem('Bem-vindo de volta.')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('register')
  @Mensagem('Conta criada. Verifique seu e-mail para ativá-la.')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    res.redirect(await this.redirect.aposVerificacaoDeEmail(token));
  }

  @Public()
  @Get('google/login')
  @UseGuards(GoogleLoginGuard)
  googleLoginPage() {}

  @Public()
  @Get('google/register')
  @UseGuards(GoogleRegisterGuard)
  googleRegisterPage() {}

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleCallbackGuard)
  async googleCallback(@Req() req: Request & { user: User | null }, @Res() res: Response) {
    if (!req.user) {
      res.redirect(this.redirect.paraLoginComErro('Não foi possível entrar com o Google.'));
      return;
    }

    res.redirect(await this.redirect.aposLoginComGoogle(req.user));
  }
}
