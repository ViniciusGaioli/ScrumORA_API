import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { MailService } from '../mail/mail.service';

interface VerifyPayload {
    sub: number;
    purpose: 'email-verify';
}

@Injectable()
export class EmailVerificationService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
        private readonly mailService: MailService,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    async sendVerificationEmail(user: User): Promise<void> {
        const token = await this.jwtService.signAsync(
        { sub: user.id, purpose: 'email-verify' } satisfies VerifyPayload,
        {
            secret: this.config.get<string>('JWT_VERIFY_SECRET'),
            expiresIn: '1h',
        },
        );

        const baseUrl = this.config.get<string>('APP_BASE_URL');
        const link = `${baseUrl}/auth/verify-email?token=${token}`;

        await this.mailService.enviarEmail({
            para: user.email,
            assunto: 'Confirme seu email — ScrumORA',
            html: this.buildEmailHtml(user.nome, link),
            texto: `Olá ${user.nome},\n\nClique no link abaixo para confirmar seu email:\n${link}\n\nEste link expira em 1 hora.\n\nSe você não criou esta conta, ignore este email.`,
        });
    }

    async verifyToken(token: string): Promise<User> {
        let payload: VerifyPayload;
        try {
            payload = await this.jwtService.verifyAsync<VerifyPayload>(token, {
                secret: this.config.get<string>('JWT_VERIFY_SECRET'),
        });
        } catch {
            throw new BadRequestException('Token inválido ou expirado');
        }

        if (payload.purpose !== 'email-verify') {
            throw new BadRequestException('Token inválido');
        }

        const user = await this.userRepo.findOne({ where: { id: payload.sub } });
        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        if (user.emailVerificado) {
            return user;
        }

        user.emailVerificado = true;
        return this.userRepo.save(user);
    }

    private buildEmailHtml(nome: string, link: string): string {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #333;">Bem-vindo ao ScrumORA, ${nome}!</h1>
                <p>Para começar a usar sua conta, confirme seu email clicando no botão abaixo:</p>
                <p style="text-align: center; margin: 30px 0;">
                <a href="${link}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                    Confirmar email
                </a>
                </p>
                <p style="color: #666; font-size: 14px;">Ou copie e cole este link no seu navegador:</p>
                <p style="color: #666; font-size: 14px; word-break: break-all;">${link}</p>
                <p style="color: #999; font-size: 12px; margin-top: 30px;">
                Este link expira em 1 hora. Se você não criou esta conta, ignore este email.
                </p>
            </div>
        `;
        }
}