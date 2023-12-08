import { Module } from '@nestjs/common';

import { InvoiceModule } from 'src/pos/invoice/invoice.module';
import { CashOnHandModule } from 'src/pos/cash-on-hand/cash-on-hand.module';
import { CashierControllerController } from './cashier-controller.controller';

const imports = [InvoiceModule, CashOnHandModule];
const controllers = [CashierControllerController];

@Module({
  imports,
  controllers
})
export class CashierControllerModule {}
