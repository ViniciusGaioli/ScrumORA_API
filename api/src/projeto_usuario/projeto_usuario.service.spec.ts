import { Test, TestingModule } from '@nestjs/testing';
import { ProjetoUsuarioService } from './projeto_usuario.service';

describe('ProjetoUsuarioService', () => {
  let service: ProjetoUsuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjetoUsuarioService],
    }).compile();

    service = module.get<ProjetoUsuarioService>(ProjetoUsuarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
