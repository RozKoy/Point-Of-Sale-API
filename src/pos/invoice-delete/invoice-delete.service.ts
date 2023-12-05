import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { InvoiceDeleteEntity } from './entity/invoice-delete.entity';

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
}
