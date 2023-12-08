import { Equal, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { InvoiceDeleteEntity } from './entity/invoice-delete.entity';
import { InvoiceEntity } from 'src/pos/invoice/entity/invoice.entity';

@Injectable()
export class InvoiceDeleteService {
	constructor (
		@InjectRepository(InvoiceDeleteEntity)
		private readonly invoiceDeleteRepository: Repository<InvoiceDeleteEntity>
	) {}

	// READ
	async getAllInvoiceDelete (): Promise<InvoiceDeleteEntity[]> {
		return await this.invoiceDeleteRepository.find();
	}

	async getInvoiceDeleteByInvoice (
		invoice: InvoiceEntity
	): Promise<InvoiceDeleteEntity | null>
	{
		return await this.invoiceDeleteRepository.findOneBy({ invoice: Equal(invoice.id) });
	}
}
