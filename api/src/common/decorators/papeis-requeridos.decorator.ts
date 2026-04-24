import { SetMetadata } from '@nestjs/common';
import { Papel } from '../../projeto_usuario/enums/papel.enum';

export const PAPEIS_REQUERIDOS_KEY = 'papeisRequeridos';

export const PapeisRequeridos = (...papeis: Papel[]) =>
    SetMetadata(PAPEIS_REQUERIDOS_KEY, papeis);