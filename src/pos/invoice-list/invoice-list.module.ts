import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvoiceListService } from './invoice-list.service';
import { InvoiceListEntity } from './entity/invoice-list.entity';

const providers = [
  {
    provide: 'INVOICE_LIST_SERVICE',
    useClass: InvoiceListService
  }
];
const imports = [TypeOrmModule.forFeature([InvoiceListEntity])];

@Module({
  imports,
  providers,
  exports: providers
})
export class InvoiceListModule {}
