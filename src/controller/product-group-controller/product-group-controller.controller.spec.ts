import { Test, TestingModule } from '@nestjs/testing';
import { ProductGroupControllerController } from './product-group-controller.controller';

describe('ProductGroupControllerController', () => {
  let controller: ProductGroupControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductGroupControllerController],
    }).compile();

    controller = module.get<ProductGroupControllerController>(ProductGroupControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
