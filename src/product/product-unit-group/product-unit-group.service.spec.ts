import { Test, TestingModule } from '@nestjs/testing';
import { ProductUnitGroupService } from './product-unit-group.service';

describe('ProductUnitGroupService', () => {
  let service: ProductUnitGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductUnitGroupService],
    }).compile();

    service = module.get<ProductUnitGroupService>(ProductUnitGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
