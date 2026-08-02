import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, type Observable } from 'rxjs';
import { MENSAGEM_KEY } from '../decorators/mensagem.decorator';
import type { Resposta } from '../envelope/envelope.types';

const MENSAGEM_PADRAO = 'Operação concluída.';

@Injectable()
export class EnvelopeInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(contexto: ExecutionContext, proximo: CallHandler): Observable<unknown> {
    const mensagem =
      this.reflector.getAllAndOverride<string>(MENSAGEM_KEY, [
        contexto.getHandler(),
        contexto.getClass(),
      ]) ?? MENSAGEM_PADRAO;

    return proximo.handle().pipe(
      map((dados: unknown): Resposta<unknown> | undefined => {
        if (dados === undefined) return undefined;
        return { mensagem, dados: dados ?? null };
      }),
    );
  }
}
