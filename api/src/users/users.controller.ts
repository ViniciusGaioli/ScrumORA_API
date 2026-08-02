import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { UsuarioAtual } from '../common/decorators/current-user.decorator';
import { ErroDominio, ErrosUsuario, Mensagem, Public } from '../common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  @Mensagem('Conta criada.')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  @Mensagem('Conta carregada.')
  findMe(@CurrentUser() user: UsuarioAtual) {
    return this.usersService.findOne(user.id);
  }

  @Patch('me')
  @Mensagem('Conta atualizada.')
  updateMe(@CurrentUser() user: UsuarioAtual, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user.id, dto);
  }

  @Delete('me')
  @HttpCode(204)
  removeMe(@CurrentUser() user: UsuarioAtual) {
    return this.usersService.remove(user.id);
  }

  @Get(':id')
  @Mensagem('Usuário carregado.')
  findOne(@CurrentUser() user: UsuarioAtual, @Param('id', ParseIntPipe) id: number) {
    if (user.id !== id) throw new ErroDominio(ErrosUsuario.SEM_PERMISSAO);
    return this.usersService.findOne(id);
  }
}
