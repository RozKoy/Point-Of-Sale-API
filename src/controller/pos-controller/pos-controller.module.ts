import { Module } from '@nestjs/common';

import { DraftModule } from 'src/pos/draft/draft.module';
import { StockModule } from 'src/inventory/stock/stock.module';
import { ProductModule } from 'src/product/product/product.module';
import { PosControllerController } from './pos-controller.controller';
import { InvoiceListModule } from 'src/pos/invoice-list/invoice-list.module';
import { ProductUnitModule } from 'src/product-group/product-unit/product-unit.module';
import { ProductPriceModule } from 'src/product-group/product-price/product-price.module';

const imports = [
  DraftModule,
  StockModule,
  ProductModule, 
  InvoiceListModule,
  ProductUnitModule,
  ProductPriceModule
];
const controllers = [PosControllerController];

@Module({
  imports,
  controllers
})
export class PosControllerModule {}
