import { Module } from '@nestjs/common';

import { CategoryModule } from 'src/product/category/category.module';
import { ProductControllerController } from './product-controller.controller';

const imports = [CategoryModule];
const controllers = [ProductControllerController];

@Module({
  imports,
  controllers
})
export class ProductControllerModule {}
