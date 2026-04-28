import { Body, Controller, Get, HttpCode, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { MailService } from 'src/mail/mail.service';
import { EmailVerificationService } from './email-verification.service';
import { Request, Response } from 'express';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { GoogleLoginGuard } from './guards/google-login.guard';
import { GoogleRegisterGuard } from './guards/google-register.guard';
import { GoogleCallbackGuard } from './guards/google-callback.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('register')
  @HttpCode(201)
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('test-email')
  async testEmail(@Body() body: { email: string }) {
    await this.mailService.enviarEmail({
      para: body.email,
      assunto: 'Teste ScrumORA',
      html: '<h1>Funcionou!</h1><p>Este é um email de teste do ScrumORA.</p>',
      texto: 'Funcionou! Este é um email de teste do ScrumORA.',
    });
    return { ok: true };
  }

  @Public()
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    if (!token) {
      return res.redirect(`${frontendUrl}/auth/login?error=${encodeURIComponent('Token não fornecido')}`);
    }
    try {
      const user = await this.emailVerificationService.verifyToken(token);
      const { accessToken } = await this.authService.loginWithGoogle(user);
      res.redirect(`${frontendUrl}/auth/google/callback?token=${accessToken}`);
    } catch (e) {
      res.redirect(`${frontendUrl}/auth/login?error=${encodeURIComponent((e as Error).message)}`);
    }
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
    if (!req.user || res.headersSent) return;
    const { accessToken } = await this.authService.loginWithGoogle(req.user);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    res.redirect(`${frontendUrl}/auth/google/callback?token=${accessToken}`);
  }
}
