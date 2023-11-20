import { Module } from '@nestjs/common';

import { ProductControllerController } from './product-controller.controller';

@Module({
  controllers: [ProductControllerController]
})
export class ProductControllerModule {}
