import {
	paginate,
	Pagination,
	IPaginationOptions
} from 'nestjs-typeorm-paginate';
import { Equal, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { InvoiceListEntity } from './entity/invoice-list.entity';
import { InvoiceEntity } from 'src/pos/invoice/entity/invoice.entity';
import { PaginationDto } from 'src/controller/invoice-controller/dto';

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

	async getInvoiceListByInvoiceWithDeleted (
		invoice: InvoiceEntity
	): Promise<InvoiceListEntity[]>
	{
		return await this.invoiceListRepository.find({
			where: { invoice: Equal(invoice.id) },
			relations: {
				unit: {
					unit: true,
					product: true
				}
			},
			withDeleted: true
		});
	}

	async getInvoiceListByInvoiceWithDeletedAndPagination (
		invoice: InvoiceEntity,
		paginationDto: PaginationDto
	): Promise<Pagination<InvoiceListEntity>>
	{
		const { page, limit } = paginationDto;
		const options: IPaginationOptions = {
			page: page || 1,
			limit: limit || 5
		};

		return await paginate(this.invoiceListRepository, options, {
			where: { invoice: Equal(invoice.id) },
			relations: {
				unit: {
					unit: true,
					product: true
				}
			},
			withDeleted: true
		});
	}
}
