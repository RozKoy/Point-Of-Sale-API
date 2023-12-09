import { Module } from '@nestjs/common';

import { StockModule } from 'src/inventory/stock/stock.module';
import { ProductModule } from 'src/product/product/product.module';
import { PosControllerController } from './pos-controller.controller';
import { ProductUnitModule } from 'src/product-group/product-unit/product-unit.module';
import { ProductPriceModule } from 'src/product-group/product-price/product-price.module';

const imports = [
  StockModule,
  ProductModule, 
  ProductUnitModule,
  ProductPriceModule
];
const controllers = [PosControllerController];

@Module({
  imports,
  controllers
})
export class PosControllerModule {}
