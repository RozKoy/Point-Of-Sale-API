import { Test, TestingModule } from '@nestjs/testing';
import { ProductUnitService } from './product-unit.service';

describe('ProductUnitService', () => {
  let service: ProductUnitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductUnitService],
    }).compile();

    service = module.get<ProductUnitService>(ProductUnitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
