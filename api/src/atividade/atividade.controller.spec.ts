import { Test, TestingModule } from '@nestjs/testing';
import { AtividadeController } from './atividade.controller';
import { AtividadeService } from './atividade.service';

describe('AtividadeController', () => {
  let controller: AtividadeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtividadeController],
      providers: [AtividadeService],
    }).compile();

    controller = module.get<AtividadeController>(AtividadeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
