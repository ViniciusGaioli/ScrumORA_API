import {CanActivate, ExecutionContext, ForbiddenException, Injectable ,NotFoundException,} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjetoUsuario } from '../../projeto_usuario/entities/projeto_usuario.entity';
import { Papel } from '../../projeto_usuario/enums/papel.enum';
import { PAPEIS_REQUERIDOS_KEY } from '../decorators/papeis-requeridos.decorator';

@Injectable()
export class PapelProjetoGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        @InjectRepository(ProjetoUsuario)
        private readonly puRepo: Repository<ProjetoUsuario>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const papeisExigidos = this.reflector.getAllAndOverride<Papel[]>(
        PAPEIS_REQUERIDOS_KEY,
        [context.getHandler(), context.getClass()],
        );

        if (!papeisExigidos || papeisExigidos.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const usuarioId: number | undefined = request.user?.id;
        if (!usuarioId) {
            throw new ForbiddenException('Usuário não autenticado');
        }

        const projetoId = this.resolverProjetoId(request);
        if (!projetoId) {
            throw new ForbiddenException('Projeto-alvo não identificado');
        }

        const vinculo = await this.puRepo.findOne({
            where: {
                usuario: { id: usuarioId },
                projeto: { id: projetoId },
            },
        });

        if (!vinculo) {
            throw new NotFoundException('Projeto não encontrado');
        }

        if (!papeisExigidos.includes(vinculo.papel)) {
            throw new ForbiddenException(
                'Você não tem permissão para realizar esta ação neste projeto',
            );
        }

        return true;
    }

    private resolverProjetoId(request: any): number | null {
        if (request.params?.projetoId) {
            const id = Number(request.params.projetoId);
            return Number.isNaN(id) ? null : id;
        }

        if (request.params?.id && request.baseUrl === '' && /^\/projetos\/\d+/.test(request.url)) {
            const id = Number(request.params.id);
            return Number.isNaN(id) ? null : id;
        }

        return null;
    }
}