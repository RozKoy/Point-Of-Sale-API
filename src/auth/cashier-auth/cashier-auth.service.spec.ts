import { Test, TestingModule } from '@nestjs/testing';
import { CashierAuthService } from './cashier-auth.service';

describe('CashierAuthService', () => {
  let service: CashierAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashierAuthService],
    }).compile();

    service = module.get<CashierAuthService>(CashierAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
