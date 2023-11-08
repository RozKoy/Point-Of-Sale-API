import { Test, TestingModule } from '@nestjs/testing';
import { CashierService } from './cashier.service';

describe('CashierService', () => {
  let service: CashierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashierService],
    }).compile();

    service = module.get<CashierService>(CashierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
