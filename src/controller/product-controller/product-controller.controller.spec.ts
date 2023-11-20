import { Test, TestingModule } from '@nestjs/testing';
import { ProductControllerController } from './product-controller.controller';

describe('ProductControllerController', () => {
  let controller: ProductControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductControllerController],
    }).compile();

    controller = module.get<ProductControllerController>(ProductControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
