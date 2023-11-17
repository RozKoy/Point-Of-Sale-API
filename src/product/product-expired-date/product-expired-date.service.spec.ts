import { Test, TestingModule } from '@nestjs/testing';
import { ProductExpiredDateService } from './product-expired-date.service';

describe('ProductExpiredDateService', () => {
  let service: ProductExpiredDateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductExpiredDateService],
    }).compile();

    service = module.get<ProductExpiredDateService>(ProductExpiredDateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
