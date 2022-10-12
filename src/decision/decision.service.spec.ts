import { Test, TestingModule } from '@nestjs/testing';
import { DecisionService } from './decision.service';

describe('DecisionService', () => {
  let service: DecisionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DecisionService],
    }).compile();

    service = module.get<DecisionService>(DecisionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
