import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvoiceGroupService } from './invoice-group.service';
import { InvoiceGroupEntity } from './entity/invoice-group.entity';

const providers = [
  {
    provide: 'INVOICE_GROUP_SERVICE',
    useClass: InvoiceGroupService
  }
];
const imports = [TypeOrmModule.forFeature([InvoiceGroupEntity])];

@Module({
  imports,
  providers
})
export class InvoiceGroupModule {}
