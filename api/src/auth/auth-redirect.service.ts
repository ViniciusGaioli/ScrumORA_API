import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { EmailVerificationService } from './email-verification.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthRedirectService {
  constructor(
    private readonly authService: AuthService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly config: ConfigService,
  ) {}

  async aposVerificacaoDeEmail(token: string | undefined): Promise<string> {
    if (!token) return this.paraLoginComErro('O link de confirmação está incompleto.');

    try {
      const usuario = await this.emailVerificationService.verifyToken(token);
      return this.paraCallbackComSessao(usuario);
    } catch {
      return this.paraLoginComErro('O link de confirmação é inválido ou expirou.');
    }
  }

  async aposLoginComGoogle(usuario: User): Promise<string> {
    return this.paraCallbackComSessao(usuario);
  }

  paraLoginComErro(mensagem: string): string {
    return `${this.frontendUrl()}/auth/login?error=${encodeURIComponent(mensagem)}`;
  }

  private async paraCallbackComSessao(usuario: User): Promise<string> {
    const { accessToken } = await this.authService.emitirSessao(usuario);
    return `${this.frontendUrl()}/auth/google/callback?token=${accessToken}`;
  }

  private frontendUrl(): string {
    return this.config.get<string>('FRONTEND_URL') ?? '';
  }
}
