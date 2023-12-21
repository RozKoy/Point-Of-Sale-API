import { 
	Raw,
	Equal,
	Between,
	Repository
} from 'typeorm';
import {
	paginate,
	Pagination,
	IPaginationOptions
} from 'nestjs-typeorm-paginate';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { InvoiceEntity } from './entity/invoice.entity';
import { CashierEntity } from 'src/user/cashier/entity/cashier.entity';
import { PaginationDto, IntervalDateDto } from 'src/controller/invoice-controller/dto';

@Injectable()
export class InvoiceService {
	constructor (
		@InjectRepository(InvoiceEntity)
		private readonly invoiceRepository: Repository<InvoiceEntity>
	) {}

	// CREATE
	async createInvoice (
		sum: string,
		discount: string,
		cashier: CashierEntity
	): Promise<InvoiceEntity>
	{
		const time: Date = new Date();
		const code: string = 'INV-' + time.getFullYear() + time.getMonth() + time.getDate() + '-' + time.getHours() + time.getMinutes() + time.getSeconds() + time.getMilliseconds();

		const newInvoice: InvoiceEntity = await this.invoiceRepository.create({
			sum,
			code,
			cashier,
			discount
		});

		return await this.invoiceRepository.save(newInvoice);
	}

	// READ
	async getAllInvoice (
		intervalDto: IntervalDateDto
	): Promise<InvoiceEntity[]>
	{
		const { to, from } = intervalDto;

		if (to && from) {
			return await this.invoiceRepository.find({
				where: {
					create_at: Between(new Date(from), new Date(to)),
				},
				order: {
					create_at: "DESC"
				},
				withDeleted: true
			});
		}

		return await this.invoiceRepository.find({
			order: {
				create_at: 'DESC'
			},
			withDeleted: true
		});
	}

	async getDailyInvoiceByCashier (
		cashier: CashierEntity
	): Promise<InvoiceEntity[]> 
	{
		return await this.invoiceRepository.find({
			where: {
				cashier: Equal(cashier.id),
				create_at: Raw(
					(alias) => `CAST(${ alias } as DATE) = CAST(NOW() as DATE)`
				)
			}
		});
	}

	async getDailyInvoiceByCashierWithPagination (
		cashier: CashierEntity,
		paginationDto: PaginationDto
	): Promise<Pagination<InvoiceEntity>> 
	{
		const { page, limit } = paginationDto;
		const options: IPaginationOptions = {
			page: page || 1,
			limit: limit || 5
		};

		return await paginate(this.invoiceRepository, options, {
			where: {
				cashier: Equal(cashier.id),
				create_at: Raw(
					(alias) => `CAST(${ alias } as DATE) = CAST(NOW() as DATE)`
				)
			},
			order: {
				create_at: 'DESC'
			}
		});
	}

	async getInvoiceById (id: string): Promise<InvoiceEntity | null> {
		return await this.invoiceRepository.findOne({
			where: { id },
			relations: {
				cashier: true
			}
		});
	}

	async getInvoiceByIdWithDeleted (id: string): Promise<InvoiceEntity | null> {
		return await this.invoiceRepository.findOne({ 
			where: { id },
			withDeleted: true
		});
	}

	// DELETE
	async delete (id: string): Promise<any> {
		return await this.invoiceRepository.softDelete(id);
	}

	// RESTORE
	async restore (id: string): Promise<any> {
		return await this.invoiceRepository.restore(id);
	}
}
