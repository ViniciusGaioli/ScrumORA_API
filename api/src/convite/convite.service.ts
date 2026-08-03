import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { ErroDominio, ErrosConvite } from '../common';
import { Papel } from '../projeto_usuario/enums/papel.enum';
import { MailService } from '../mail/mail.service';
import { CONVITE_REPOSITORY, type ConviteRepository } from './convite.repository';

const VALIDADE_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class ConviteService {
    constructor(
        @Inject(CONVITE_REPOSITORY)
        private readonly repositorio: ConviteRepository,
        private readonly mailService: MailService,
        private readonly config: ConfigService,
    ) {}

    async criarConvite(projetoId: number, email?: string): Promise<{ token: string; link: string }> {
        const projeto = await this.repositorio.buscarProjeto(projetoId);
        if (!projeto) throw new ErroDominio(ErrosConvite.INVALIDO);

        const token = randomUUID();

        await this.repositorio.criar({
            projetoId,
            token,
            email: email ?? null,
            papel: Papel.DEVELOPER,
            expiresAt: new Date(Date.now() + VALIDADE_MS),
        });

        const link = `${this.config.get<string>('FRONTEND_URL')}/convite/${token}`;

        if (email) {
            await this.mailService.enviarEmail({
                para: email,
                assunto: `Convite para o projeto "${projeto.nome}" — ScrumORA`,
                html: this.buildConviteHtml(projeto.nome, link),
                texto: `Você foi convidado para o projeto "${projeto.nome}".\n\nClique no link abaixo para aceitar:\n${link}\n\nEste link expira em 7 dias.`,
            });
        }

        return { token, link };
    }

    async aceitarConvite(
        token: string,
        userId: number,
    ): Promise<{ projetoId: number; nomeProjeto: string }> {
        const convite = await this.repositorio.buscarPorToken(token);

        if (!convite) throw new ErroDominio(ErrosConvite.INVALIDO);
        if (convite.usadoEm) throw new ErroDominio(ErrosConvite.INVALIDO);
        if (new Date() > convite.expiresAt) throw new ErroDominio(ErrosConvite.INVALIDO);

        const projetoId = convite.projeto.id;

        if (!(await this.repositorio.participaDoProjeto(userId, projetoId))) {
            const vinculou = await this.repositorio.vincularAoProjeto(userId, projetoId, convite.papel);
            if (!vinculou) throw new ErroDominio(ErrosConvite.INVALIDO);

            await this.repositorio.marcarComoUsado(convite);
        }

        return { projetoId, nomeProjeto: convite.projeto.nome };
    }

    private buildConviteHtml(nomeProjeto: string, link: string): string {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #333;">Você foi convidado!</h1>
                <p>Você recebeu um convite para participar do projeto <strong>${nomeProjeto}</strong> no ScrumORA.</p>
                <p style="text-align: center; margin: 30px 0;">
                    <a href="${link}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                        Aceitar convite
                    </a>
                </p>
                <p style="color: #666; font-size: 14px;">Ou copie e cole este link no seu navegador:</p>
                <p style="color: #666; font-size: 14px; word-break: break-all;">${link}</p>
                <p style="color: #999; font-size: 12px; margin-top: 30px;">
                    Este link expira em 7 dias. Se você não esperava este convite, ignore este email.
                </p>
            </div>
        `;
    }
}
