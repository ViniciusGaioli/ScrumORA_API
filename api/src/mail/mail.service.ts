import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService implements OnModuleInit {
    private readonly logger = new Logger(MailService.name);
    private transporter!: Transporter;
    private fromName!: string;
    private fromAddress!: string;

    constructor(private readonly config: ConfigService) {}

    onModuleInit() {
        this.transporter = nodemailer.createTransport({
        host: this.config.get<string>('MAIL_HOST'),
        port: Number(this.config.get('MAIL_PORT')),
        secure: this.config.get<string>('MAIL_SECURE') === 'true',
        auth: {
            user: this.config.get<string>('MAIL_USER'),
            pass: this.config.get<string>('MAIL_PASSWORD'),
        },
    });

    this.fromName = this.config.get<string>('MAIL_FROM_NAME') ?? 'ScrumORA';
    this.fromAddress = this.config.get<string>('MAIL_FROM_ADDRESS')!;

    this.transporter.verify()
        .then(() => this.logger.log('Conexão SMTP estabelecida'))
        .catch((err) => this.logger.error('Falha na conexão SMTP', err));
    }

    async enviarEmail(params: {
        para: string;
        assunto: string;
        html: string;
        texto?: string;
    }): Promise<void> {
    try {
        await this.transporter.sendMail({
            from: `"${this.fromName}" <${this.fromAddress}>`,
            to: params.para,
            subject: params.assunto,
            html: params.html,
            text: params.texto,
        });
        this.logger.log(`Email enviado para ${params.para}`);
        } catch (error) {
        this.logger.error(`Falha ao enviar email para ${params.para}`, error);
        throw error;
        }
    }
}