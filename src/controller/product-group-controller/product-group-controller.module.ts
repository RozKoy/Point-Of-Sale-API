import { Module } from '@nestjs/common';

import { UnitModule } from 'src/product/unit/unit.module';
import { StockModule } from 'src/inventory/stock/stock.module';
import { ProductModule } from 'src/product/product/product.module';
import { CategoryModule } from 'src/product/category/category.module';
import { ProductUnitModule } from 'src/product-group/product-unit/product-unit.module';
import { ProductPriceModule } from 'src/product-group/product-price/product-price.module';
import { ProductCategoryModule } from 'src/product-group/product-category/product-category.module';
import { ProductExpiredDateModule } from 'src/product/product-expired-date/product-expired-date.module';

import { ProductGroupControllerController } from './product-group-controller.controller';

const imports = [
  UnitModule,
  StockModule,
  ProductModule,
  CategoryModule,
  ProductUnitModule,
  ProductPriceModule,
  ProductCategoryModule,
  ProductExpiredDateModule
];
const controllers = [ProductGroupControllerController];

@Module({
  imports,
  controllers
})
export class ProductGroupControllerModule {}
