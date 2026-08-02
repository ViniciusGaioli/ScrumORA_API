export { CurrentUser } from './decorators/current-user.decorator';
export { Mensagem } from './decorators/mensagem.decorator';
export { PapeisRequeridos } from './decorators/papeis-requeridos.decorator';
export { Public } from './decorators/public.decorator';

export * from './errors/catalogo';
export { ErroDominio } from './errors/erro-dominio.exception';

export { ErroFilter } from './filters/erro.filter';
export { EnvelopeInterceptor } from './interceptors/envelope.interceptor';

export type { Erro, ErroDetalhado, Operacao, Resposta } from './envelope/envelope.types';
