import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategoryGroupService } from './product-category-group.service';

describe('ProductCategoryGroupService', () => {
  let service: ProductCategoryGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductCategoryGroupService],
    }).compile();

    service = module.get<ProductCategoryGroupService>(ProductCategoryGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
