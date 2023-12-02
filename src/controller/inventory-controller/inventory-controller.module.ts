import { Module } from '@nestjs/common';

import { InventoryControllerController } from './inventory-controller.controller';

const controllers = [InventoryControllerController];

@Module({
  controllers
})
export class InventoryControllerModule {}
