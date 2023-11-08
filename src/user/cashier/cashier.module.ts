import { Module } from '@nestjs/common';

import { CashierService } from './cashier.service';
import { CashierController } from './cashier.controller';

@Module({
  providers: [CashierService],
  controllers: [CashierController]
})
export class CashierModule {}
