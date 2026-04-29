import { Body, Controller, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ConviteService } from './convite.service';
import { CriarConviteDto } from './dto/criar-convite.dto';
import { PapelProjetoGuard } from '../common/guards/papel-projeto.guard';
import { PapeisRequeridos } from '../common/decorators/papeis-requeridos.decorator';
import { Papel } from '../projeto_usuario/enums/papel.enum';
import { CurrentUser, UsuarioAtual } from '../common/decorators/current-user.decorator';

@Controller()
export class ConviteController {
    constructor(private readonly conviteService: ConviteService) {}

    @Post('projetos/:projetoId/convites')
    @UseGuards(PapelProjetoGuard)
    @PapeisRequeridos(Papel.SCRUM_MASTER, Papel.PRODUCT_OWNER)
    criar(
        @Param('projetoId', ParseIntPipe) projetoId: number,
        @Body() dto: CriarConviteDto,
    ) {
        return this.conviteService.criarConvite(projetoId, dto.email);
    }

    @Post('convites/:token/aceitar')
    aceitar(
        @Param('token') token: string,
        @CurrentUser() user: UsuarioAtual,
    ) {
        return this.conviteService.aceitarConvite(token, user.id);
    }
}
