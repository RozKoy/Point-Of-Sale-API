import { Test, TestingModule } from '@nestjs/testing';
import { ProductPriceService } from './product-price.service';

describe('ProductPriceService', () => {
  let service: ProductPriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductPriceService],
    }).compile();

    service = module.get<ProductPriceService>(ProductPriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
