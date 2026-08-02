import { HttpException } from '@nestjs/common';
import type { EntradaCatalogo } from './catalogo';

export class ErroDominio extends HttpException {
  readonly codigo: string;
  readonly campos?: Record<string, string>;

  constructor(entrada: EntradaCatalogo, campos?: Record<string, string>) {
    super({ codigo: entrada.codigo, mensagem: entrada.mensagem }, entrada.status);
    this.codigo = entrada.codigo;
    this.campos = campos;
  }
}
