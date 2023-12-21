import { Equal, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { InvoiceDeleteEntity } from './entity/invoice-delete.entity';
import { InvoiceEntity } from 'src/pos/invoice/entity/invoice.entity';
import { CashierEntity } from 'src/user/cashier/entity/cashier.entity';

@Injectable()
export class InvoiceDeleteService {
	constructor (
		@InjectRepository(InvoiceDeleteEntity)
		private readonly invoiceDeleteRepository: Repository<InvoiceDeleteEntity>
	) {}

	// CREATE
	async createInvoiceDeleteRequest (
		message: string,
		invoice: InvoiceEntity,
		cashier: CashierEntity
	): Promise<InvoiceDeleteEntity>
	{
		const newInvoiceDeleteRequest: InvoiceDeleteEntity = await this.invoiceDeleteRepository.create({
			message,
			invoice,
			cashier
		});

		return await this.invoiceDeleteRepository.save(newInvoiceDeleteRequest);
	}

	// READ
	async getAllInvoiceDelete (): Promise<InvoiceDeleteEntity[]> {
		return await this.invoiceDeleteRepository.find({ 
			relations: { invoice: { cashier: true } },
			order: {
				create_at: 'DESC'
			},
			withDeleted: true
		});
	}

	async getInvoiceDeleteByInvoiceWithDeleted (
		invoice: InvoiceEntity
	): Promise<InvoiceDeleteEntity | null>
	{
		return await this.invoiceDeleteRepository.findOne({ 
			where: {
				invoice: Equal(invoice.id) 
			},
			withDeleted: true
		});
	}

	// UPDATE
	async update (id: string, author: AdminEntity): Promise<InvoiceDeleteEntity> {
		const deleteRequest: InvoiceDeleteEntity = await this.invoiceDeleteRepository.findOneBy({ id });

		deleteRequest.author = author;

		return await this.invoiceDeleteRepository.save(deleteRequest);
	}

	// DELETE
	async delete (id: string): Promise<any> {
		return await this.invoiceDeleteRepository.softDelete(id);
	} 
}
