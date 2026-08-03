import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleCallbackGuard extends AuthGuard('google') {
  handleRequest<T>(_err: unknown, user: T | false): T {
    return (user || null) as T;
  }
}
