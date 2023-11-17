import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvoiceDeleteService } from './invoice-delete.service';
import { InvoiceDeleteEntity } from './entity/invoice-delete.entity';

const providers = [
	{
		provide: 'INVOICE_DELETE_SERVICE',
		useClass: InvoiceDeleteService
	}
];
const imports = [TypeOrmModule.forFeature([InvoiceDeleteEntity])];

@Module({
	imports,
	providers
})
export class InvoiceDeleteModule {}
