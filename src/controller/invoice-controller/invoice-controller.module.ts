import { Module } from '@nestjs/common';

import { InvoiceModule } from 'src/pos/invoice/invoice.module';
import { InvoiceListModule } from 'src/pos/invoice-list/invoice-list.module';
import { InvoiceDeleteModule } from 'src/pos/invoice-delete/invoice-delete.module';

import { InvoiceControllerController } from './invoice-controller.controller';

const controllers = [InvoiceControllerController];
const imports = [
  InvoiceModule, 
  InvoiceListModule,
  InvoiceDeleteModule
];

@Module({
  imports,
  controllers
})
export class InvoiceControllerModule {}
