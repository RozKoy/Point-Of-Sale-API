import { Module } from '@nestjs/common';

import { NotificationControllerController } from './notification-controller.controller';

const controllers = [NotificationControllerController];

@Module({
  controllers
})
export class NotificationControllerModule {}
