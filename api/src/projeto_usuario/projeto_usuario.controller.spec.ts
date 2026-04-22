import { Test, TestingModule } from '@nestjs/testing';
import { ProjetoUsuarioController } from './projeto_usuario.controller';
import { ProjetoUsuarioService } from './projeto_usuario.service';

describe('ProjetoUsuarioController', () => {
  let controller: ProjetoUsuarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjetoUsuarioController],
      providers: [ProjetoUsuarioService],
    }).compile();

    controller = module.get<ProjetoUsuarioController>(ProjetoUsuarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
