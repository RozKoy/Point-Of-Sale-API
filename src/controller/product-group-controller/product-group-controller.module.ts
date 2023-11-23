import { Module } from '@nestjs/common';

import { ProductGroupControllerController } from './product-group-controller.controller';

@Module({
  controllers: [ProductGroupControllerController]
})
export class ProductGroupControllerModule {}
