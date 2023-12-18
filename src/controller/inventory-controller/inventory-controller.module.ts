import { Module } from '@nestjs/common';

import { StockModule } from 'src/inventory/stock/stock.module';
import { StockRecordModule } from 'src/inventory/stock-record/stock-record.module';
import { ProductUnitModule } from 'src/product-group/product-unit/product-unit.module';

import { InventoryControllerController } from './inventory-controller.controller';

const imports = [StockModule, StockRecordModule, ProductUnitModule];
const controllers = [InventoryControllerController];

@Module({
	imports,
	controllers
})
export class InventoryControllerModule {}
