import { HttpStatus } from '@nestjs/common';

export interface EntradaCatalogo {
  codigo: string;
  mensagem: string;
  status: number;
}

function definir(
  prefixo: string,
  entradas: Record<string, { mensagem: string; status: number }>,
): Record<string, EntradaCatalogo> {
  const catalogo: Record<string, EntradaCatalogo> = {};

  for (const chave of Object.keys(entradas)) {
    catalogo[chave] = {
      codigo: `${prefixo}.${chave}`,
      mensagem: entradas[chave].mensagem,
      status: entradas[chave].status,
    };
  }

  return catalogo;
}

export const ErrosUsuario = definir('USER', {
  NAO_ENCONTRADO: { mensagem: 'Usuário não encontrado.', status: HttpStatus.NOT_FOUND },
  EMAIL_EM_USO: { mensagem: 'Já existe uma conta com este e-mail.', status: HttpStatus.CONFLICT },
  SEM_PERMISSAO: { mensagem: 'Você só pode alterar a própria conta.', status: HttpStatus.FORBIDDEN },
});

export const ErrosAuth = definir('AUTH', {
  CREDENCIAIS_INVALIDAS: { mensagem: 'E-mail ou senha incorretos.', status: HttpStatus.UNAUTHORIZED },
  EMAIL_NAO_VERIFICADO: {
    mensagem: 'Confirme seu e-mail antes de entrar. Verifique a caixa de entrada e o spam.',
    status: HttpStatus.FORBIDDEN,
  },
  CONTA_SEM_SENHA: {
    mensagem: 'Esta conta usa login pelo Google.',
    status: HttpStatus.UNAUTHORIZED,
  },
});

export const ErrosProjeto = definir('PROJECT', {
  NAO_ENCONTRADO: { mensagem: 'Projeto não encontrado.', status: HttpStatus.NOT_FOUND },
  SEM_PERMISSAO: {
    mensagem: 'Você não tem permissão para alterar este projeto.',
    status: HttpStatus.FORBIDDEN,
  },
});

export const ErrosMembro = definir('MEMBER', {
  NAO_ENCONTRADO: { mensagem: 'Integrante não encontrado neste projeto.', status: HttpStatus.NOT_FOUND },
  JA_PARTICIPA: { mensagem: 'Este usuário já participa do projeto.', status: HttpStatus.CONFLICT },
  ULTIMO_RESPONSAVEL: {
    mensagem: 'O projeto precisa de ao menos um Product Owner ou Scrum Master.',
    status: HttpStatus.CONFLICT,
  },
});

export const ErrosEquipe = definir('TEAM', {
  NAO_ENCONTRADA: { mensagem: 'Equipe não encontrada.', status: HttpStatus.NOT_FOUND },
  NOME_EM_USO: {
    mensagem: 'Já existe uma equipe com esse nome neste projeto.',
    status: HttpStatus.CONFLICT,
  },
});

export const ErrosSprint = definir('SPRINT', {
  NAO_ENCONTRADA: { mensagem: 'Sprint não encontrada.', status: HttpStatus.NOT_FOUND },
  DATAS_INVALIDAS: {
    mensagem: 'A data final deve ser posterior à inicial.',
    status: HttpStatus.BAD_REQUEST,
  },
});

export const ErrosAtividade = definir('ACTIVITY', {
  NAO_ENCONTRADA: { mensagem: 'Atividade não encontrada.', status: HttpStatus.NOT_FOUND },
  DATAS_INVALIDAS: {
    mensagem: 'A data final deve ser posterior à inicial.',
    status: HttpStatus.BAD_REQUEST,
  },
});

export const ErrosResponsavel = definir('ACTIVITY_ASSIGNEE', {
  NAO_ENCONTRADO: { mensagem: 'Responsável não encontrado.', status: HttpStatus.NOT_FOUND },
  VINCULO_DUPLICADO: {
    mensagem: 'Esse responsável já está vinculado à atividade.',
    status: HttpStatus.CONFLICT,
  },
});

export const ErrosConvite = definir('INVITE', {
  INVALIDO: { mensagem: 'Convite inválido ou expirado.', status: HttpStatus.NOT_FOUND },
  JA_PARTICIPA: { mensagem: 'Você já faz parte deste projeto.', status: HttpStatus.CONFLICT },
});

export const ErrosComuns = definir('COMMON', {
  DADOS_INVALIDOS: { mensagem: 'Verifique os dados enviados.', status: HttpStatus.BAD_REQUEST },
  ROTA_NAO_ENCONTRADA: { mensagem: 'Recurso não encontrado.', status: HttpStatus.NOT_FOUND },
  CONFLITO: { mensagem: 'A operação conflita com o estado atual.', status: HttpStatus.CONFLICT },
  SEM_PERMISSAO: {
    mensagem: 'Você não tem permissão para esta ação.',
    status: HttpStatus.FORBIDDEN,
  },
  NAO_AUTENTICADO: { mensagem: 'Sua sessão expirou. Entre novamente.', status: HttpStatus.UNAUTHORIZED },
  INTERNO: {
    mensagem: 'Não foi possível concluir a operação.',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },
});
