import { Test, TestingModule } from '@nestjs/testing';
import { AtividadeResponsavelService } from './atividade-responsavel.service';

describe('AtividadeResponsavelService', () => {
  let service: AtividadeResponsavelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AtividadeResponsavelService],
    }).compile();

    service = module.get<AtividadeResponsavelService>(AtividadeResponsavelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
