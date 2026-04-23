import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UsuarioAtual {
    id: number;
    email: string;
}

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): UsuarioAtual => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);