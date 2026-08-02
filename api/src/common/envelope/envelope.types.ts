export interface Resposta<TDados> {
  mensagem: string;
  dados: TDados;
}

export interface ErroDetalhado {
  codigo: string;
  mensagem: string;
  status: number;
  campos?: Record<string, string>;
}

export interface Erro {
  erro: ErroDetalhado;
}

export type Operacao<TDados> = Resposta<TDados> | Erro;
