import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvoiceService } from './invoice.service';
import { InvoiceEntity } from './entity/invoice.entity';

const providers = [
  {
    provide: 'INVOICE_SERVICE',
    useClass: InvoiceService
  }
];
const imports = [TypeOrmModule.forFeature([InvoiceEntity])];

@Module({
  imports,
  providers
})
export class InvoiceModule {}
