import { Test, TestingModule } from '@nestjs/testing';
import { ProductPrizeGroupService } from './product-prize-group.service';

describe('ProductPrizeGroupService', () => {
  let service: ProductPrizeGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductPrizeGroupService],
    }).compile();

    service = module.get<ProductPrizeGroupService>(ProductPrizeGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
