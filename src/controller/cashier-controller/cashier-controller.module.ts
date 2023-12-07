import { Module } from '@nestjs/common';

import { CashierControllerController } from './cashier-controller.controller';

const controllers = [CashierControllerController];

@Module({
  controllers
})
export class CashierControllerModule {}
