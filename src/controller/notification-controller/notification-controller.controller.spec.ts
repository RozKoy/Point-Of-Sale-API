import { Test, TestingModule } from '@nestjs/testing';
import { NotificationControllerController } from './notification-controller.controller';

describe('NotificationControllerController', () => {
  let controller: NotificationControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationControllerController],
    }).compile();

    controller = module.get<NotificationControllerController>(NotificationControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
