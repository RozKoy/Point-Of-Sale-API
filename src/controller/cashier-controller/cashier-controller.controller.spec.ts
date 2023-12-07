import { Test, TestingModule } from '@nestjs/testing';
import { CashierControllerController } from './cashier-controller.controller';

describe('CashierControllerController', () => {
  let controller: CashierControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashierControllerController],
    }).compile();

    controller = module.get<CashierControllerController>(CashierControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
