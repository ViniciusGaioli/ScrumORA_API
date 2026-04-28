import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IAuthModuleOptions } from '@nestjs/passport';

@Injectable()
export class GoogleRegisterGuard extends AuthGuard('google') {
  getAuthenticateOptions(_context: ExecutionContext): IAuthModuleOptions {
    return { state: 'register' } as IAuthModuleOptions;
  }
}
