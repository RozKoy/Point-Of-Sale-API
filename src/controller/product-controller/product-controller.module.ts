import { Module } from '@nestjs/common';

import { UnitModule } from 'src/product/unit/unit.module';
import { CategoryModule } from 'src/product/category/category.module';
import { ProductControllerController } from './product-controller.controller';

const imports = [UnitModule, CategoryModule];
const controllers = [ProductControllerController];

@Module({
  imports,
  controllers
})
export class ProductControllerModule {}
