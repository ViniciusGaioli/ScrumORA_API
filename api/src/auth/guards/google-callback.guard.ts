import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Injectable()
export class GoogleCallbackGuard extends AuthGuard('google') {
  handleRequest<T>(err: unknown, user: T | false, _info: unknown, context: ExecutionContext): T {
    if (err || !user) {
      const res = context.switchToHttp().getResponse<Response>();
      const message = (err as Error)?.message ?? 'Erro na autenticação com Google.';
      res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=${encodeURIComponent(message)}`);
      return null as unknown as T;
    }
    return user as T;
  }
}
