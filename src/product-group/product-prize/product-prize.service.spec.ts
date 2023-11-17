import { Test, TestingModule } from '@nestjs/testing';
import { ProductPrizeService } from './product-prize.service';

describe('ProductPrizeService', () => {
  let service: ProductPrizeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductPrizeService],
    }).compile();

    service = module.get<ProductPrizeService>(ProductPrizeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
