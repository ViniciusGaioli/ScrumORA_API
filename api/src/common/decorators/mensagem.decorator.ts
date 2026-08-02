import { SetMetadata } from '@nestjs/common';

export const MENSAGEM_KEY = 'mensagemResposta';

export const Mensagem = (mensagem: string) => SetMetadata(MENSAGEM_KEY, mensagem);
