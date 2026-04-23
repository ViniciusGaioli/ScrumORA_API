import { PartialType } from '@nestjs/mapped-types';
import { CreateAtividadeResponsavelDto } from './create-atividade-responsavel.dto';

export class UpdateAtividadeResponsavelDto extends PartialType(CreateAtividadeResponsavelDto) {}
