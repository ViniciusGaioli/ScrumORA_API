import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { ErrosComuns } from '../errors/catalogo';
import { ErroDominio } from '../errors/erro-dominio.exception';
import type { Erro } from '../envelope/envelope.types';

const CODIGO_POR_STATUS: Record<number, { codigo: string; mensagem: string }> = {
  [HttpStatus.BAD_REQUEST]: ErrosComuns.DADOS_INVALIDOS,
  [HttpStatus.UNAUTHORIZED]: ErrosComuns.NAO_AUTENTICADO,
  [HttpStatus.FORBIDDEN]: ErrosComuns.SEM_PERMISSAO,
  [HttpStatus.NOT_FOUND]: ErrosComuns.ROTA_NAO_ENCONTRADA,
  [HttpStatus.CONFLICT]: ErrosComuns.CONFLITO,
};

function camposDaValidacao(resposta: unknown): Record<string, string> | undefined {
  const mensagem = (resposta as { message?: unknown })?.message;
  if (!Array.isArray(mensagem)) return undefined;

  const campos: Record<string, string> = {};
  for (const item of mensagem) {
    if (typeof item !== 'string') continue;
    const campo = item.split(' ')[0];
    if (!(campo in campos)) campos[campo] = item;
  }

  return Object.keys(campos).length > 0 ? campos : undefined;
}

@Catch()
export class ErroFilter implements ExceptionFilter {
  private readonly logger = new Logger(ErroFilter.name);

  catch(excecao: unknown, host: ArgumentsHost): void {
    const resposta = host.switchToHttp().getResponse<Response>();

    if (excecao instanceof ErroDominio) {
      const corpo = excecao.getResponse() as { codigo: string; mensagem: string };
      resposta.status(excecao.getStatus()).json(this.envelope({
        codigo: corpo.codigo,
        mensagem: corpo.mensagem,
        status: excecao.getStatus(),
        campos: excecao.campos,
      }));
      return;
    }

    if (excecao instanceof HttpException) {
      const status = excecao.getStatus();
      const conhecido = CODIGO_POR_STATUS[status] ?? ErrosComuns.INTERNO;

      resposta.status(status).json(this.envelope({
        codigo: conhecido.codigo,
        mensagem: conhecido.mensagem,
        status,
        campos: camposDaValidacao(excecao.getResponse()),
      }));
      return;
    }

    this.logger.error('Exceção não tratada', excecao instanceof Error ? excecao.stack : excecao);

    resposta.status(ErrosComuns.INTERNO.status).json(this.envelope({
      codigo: ErrosComuns.INTERNO.codigo,
      mensagem: ErrosComuns.INTERNO.mensagem,
      status: ErrosComuns.INTERNO.status,
    }));
  }

  private envelope(erro: Erro['erro']): Erro {
    return { erro };
  }
}
