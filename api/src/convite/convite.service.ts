import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Convite } from './entities/convite.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { ProjetoUsuario } from '../projeto_usuario/entities/projeto_usuario.entity';
import { User } from '../users/entities/user.entity';
import { Papel } from '../projeto_usuario/enums/papel.enum';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ConviteService {
    constructor(
        @InjectRepository(Convite)
        private readonly conviteRepo: Repository<Convite>,
        @InjectRepository(Projeto)
        private readonly projetoRepo: Repository<Projeto>,
        @InjectRepository(ProjetoUsuario)
        private readonly puRepo: Repository<ProjetoUsuario>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly mailService: MailService,
        private readonly config: ConfigService,
    ) {}

    async criarConvite(projetoId: number, email?: string): Promise<{ token: string; link: string }> {
        const projeto = await this.projetoRepo.findOne({ where: { id: projetoId } });
        if (!projeto) throw new NotFoundException(`Projeto ${projetoId} não encontrado`);

        const token = randomUUID();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const convite = this.conviteRepo.create({
            token,
            projeto,
            email: email ?? null,
            papel: Papel.DEVELOPER,
            expiresAt,
            usadoEm: null,
        });
        await this.conviteRepo.save(convite);

        const frontendUrl = this.config.get<string>('FRONTEND_URL');
        const link = `${frontendUrl}/convite/${token}`;

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

    async aceitarConvite(token: string, userId: number): Promise<{ projetoId: number; nomeProjeto: string }> {
        const convite = await this.conviteRepo.findOne({
            where: { token },
            relations: ['projeto'],
        });

        if (!convite) throw new NotFoundException('Convite não encontrado');
        if (convite.usadoEm) throw new BadRequestException('Este convite já foi utilizado');
        if (new Date() > convite.expiresAt) throw new BadRequestException('Este convite expirou');

        const jaExiste = await this.puRepo.findOne({
            where: { usuario: { id: userId }, projeto: { id: convite.projeto.id } },
        });

        if (!jaExiste) {
            const usuario = await this.userRepo.findOne({ where: { id: userId } });
            if (!usuario) throw new NotFoundException('Usuário não encontrado');

            const pu = this.puRepo.create({ usuario, projeto: convite.projeto, papel: convite.papel });
            await this.puRepo.save(pu);

            convite.usadoEm = new Date();
            await this.conviteRepo.save(convite);
        }

        return { projetoId: convite.projeto.id, nomeProjeto: convite.projeto.nome };
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
