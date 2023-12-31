import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Configuration, TypeOrmConfig } from './config';

import { DraftModule } from './pos/draft/draft.module';
import { AdminModule } from './user/admin/admin.module';
import { UnitModule } from './product/unit/unit.module';
import { StockModule } from './inventory/stock/stock.module';
import { InvoiceModule } from './pos/invoice/invoice.module';
import { CashierModule } from './user/cashier/cashier.module';
import { ProductModule } from './product/product/product.module';
import { CategoryModule } from './product/category/category.module';
import { AdminAuthModule } from './auth/admin-auth/admin-auth.module';
import { CashOnHandModule } from './pos/cash-on-hand/cash-on-hand.module';
import { InvoiceListModule } from './pos/invoice-list/invoice-list.module';
import { CashierAuthModule } from './auth/cashier-auth/cashier-auth.module';
import { InvoiceDeleteModule } from './pos/invoice-delete/invoice-delete.module';
import { StockRecordModule } from './inventory/stock-record/stock-record.module';
import { ProductUnitModule } from './product-group/product-unit/product-unit.module';
import { ProductPriceModule } from './product-group/product-price/product-price.module';
import { ProductCategoryModule } from './product-group/product-category/product-category.module';
import { ProductExpiredDateModule } from './product/product-expired-date/product-expired-date.module';

import { PosControllerModule } from './controller/pos-controller/pos-controller.module';
import { ProductControllerModule } from './controller/product-controller/product-controller.module';
import { InvoiceControllerModule } from './controller/invoice-controller/invoice-controller.module';
import { CashierControllerModule } from './controller/cashier-controller/cashier-controller.module';
import { InventoryControllerModule } from './controller/inventory-controller/inventory-controller.module';
import { NotificationControllerModule } from './controller/notification-controller/notification-controller.module';
import { ProductGroupControllerModule } from './controller/product-group-controller/product-group-controller.module';

@Module({
	imports: [
		ConfigModule.forRoot({ 
			isGlobal: true, 
			load: [Configuration] 
		}), 
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useClass: TypeOrmConfig,
		}), 
		UnitModule, 
		AdminModule, 
		StockModule, 
		DraftModule, 
		CashierModule, 
		InvoiceModule, 
		ProductModule,
		CategoryModule, 
		AdminAuthModule, 
		CashOnHandModule, 
		CashierAuthModule, 
		InvoiceListModule, 
		ProductUnitModule,
		StockRecordModule, 
		ProductPriceModule, 
		InvoiceDeleteModule, 
		ProductCategoryModule, 
		ProductExpiredDateModule, 

		PosControllerModule, 
		ProductControllerModule, 
		CashierControllerModule, 
		InvoiceControllerModule, 
		InventoryControllerModule, 
		NotificationControllerModule, 
		ProductGroupControllerModule, 
		]
})
export class AppModule {}
