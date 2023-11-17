import { Test, TestingModule } from '@nestjs/testing';
import { CashOnHandService } from './cash-on-hand.service';

describe('CashOnHandService', () => {
  let service: CashOnHandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashOnHandService],
    }).compile();

    service = module.get<CashOnHandService>(CashOnHandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
