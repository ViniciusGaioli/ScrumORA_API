import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, StrategyOptionsWithRequest } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: config.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL: config.get<string>('GOOGLE_CALLBACK_URL')!,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  async validate(req: Request, _accessToken: string, _refreshToken: string, profile: Profile): Promise<User> {
    const action = req.query['state'] as string;
    const email = profile.emails?.[0]?.value;
    const fotoPerfil = profile.photos?.[0]?.value;

    if (!email) {
      throw new UnauthorizedException('Não foi possível obter o email da conta Google.');
    }

    if (action === 'register') {
      return this.usersService.findOrCreateByGoogle({
        googleId: profile.id,
        email,
        nome: profile.displayName,
        fotoPerfil,
      });
    }

    const user = await this.usersService.findByGoogle(profile.id, email);
    if (!user) {
      throw new UnauthorizedException('Nenhuma conta encontrada com este Google. Cadastre-se primeiro.');
    }
    return user;
  }
}
