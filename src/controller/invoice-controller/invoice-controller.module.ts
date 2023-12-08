import { Module } from '@nestjs/common';

import { InvoiceControllerController } from './invoice-controller.controller';

const controllers = [InvoiceControllerController];

@Module({
  controllers
})
export class InvoiceControllerModule {}
