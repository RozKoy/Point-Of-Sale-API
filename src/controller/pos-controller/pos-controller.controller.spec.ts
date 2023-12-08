import { Test, TestingModule } from '@nestjs/testing';
import { PosControllerController } from './pos-controller.controller';

describe('PosControllerController', () => {
  let controller: PosControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PosControllerController],
    }).compile();

    controller = module.get<PosControllerController>(PosControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
