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
import { ProductUnitEntity } from 'src/product-group/product-unit/entity/product-unit.entity';

@Injectable()
export class InvoiceListService {
	constructor (
		@InjectRepository(InvoiceListEntity)
		private readonly invoiceListRepository: Repository<InvoiceListEntity>
	) {}

	// CREATE
	async createInvoiceList (
		sum: string,
		quantity: string,
		invoice: InvoiceEntity,
		unit: ProductUnitEntity
	): Promise<InvoiceListEntity>
	{
		const newInvoiceList: InvoiceListEntity = await this.invoiceListRepository.create({
			sum,
			unit,
			invoice,
			quantity
		});

		return await this.invoiceListRepository.save(newInvoiceList);
	}

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
