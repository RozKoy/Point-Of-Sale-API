import { Equal, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { InvoiceListEntity } from './entity/invoice-list.entity';
import { InvoiceEntity } from 'src/pos/invoice/entity/invoice.entity';

@Injectable()
export class InvoiceListService {
	constructor (
		@InjectRepository(InvoiceListEntity)
		private readonly invoiceListRepository: Repository<InvoiceListEntity>
	) {}

	// READ
	async getInvoiceListByInvoice (
		invoice: InvoiceEntity
	): Promise<InvoiceListEntity[]>
	{
		return await this.invoiceListRepository.find({
			where: { invoice: Equal(invoice.id) }
		});
	}
}
