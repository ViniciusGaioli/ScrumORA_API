import { Test, TestingModule } from '@nestjs/testing';
import { AtividadeResponsavelController } from './atividade-responsavel.controller';
import { AtividadeResponsavelService } from './atividade-responsavel.service';

describe('AtividadeResponsavelController', () => {
  let controller: AtividadeResponsavelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtividadeResponsavelController],
      providers: [AtividadeResponsavelService],
    }).compile();

    controller = module.get<AtividadeResponsavelController>(AtividadeResponsavelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
