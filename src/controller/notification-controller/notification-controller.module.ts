import { Module } from '@nestjs/common';

import { ProductModule } from 'src/product/product/product.module';
import { InvoiceDeleteModule } from 'src/pos/invoice-delete/invoice-delete.module';
import { ProductExpiredDateModule } from 'src/product/product-expired-date/product-expired-date.module';

import { NotificationControllerController } from './notification-controller.controller';

const imports = [ProductModule, InvoiceDeleteModule, ProductExpiredDateModule];
const controllers = [NotificationControllerController];

@Module({
	imports,
	controllers
})
export class NotificationControllerModule {}
