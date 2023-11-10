import { Test, TestingModule } from '@nestjs/testing';
import { CashierAuthController } from './cashier-auth.controller';

describe('CashierAuthController', () => {
  let controller: CashierAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashierAuthController],
    }).compile();

    controller = module.get<CashierAuthController>(CashierAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
