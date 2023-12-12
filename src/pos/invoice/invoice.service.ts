import { 
	Raw,
	Equal,
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

	// READ
	async getAllInvoice (
		intervalDto: IntervalDateDto
	): Promise<InvoiceEntity[]>
	{
		const { to, from } = intervalDto;

		if (to && from) {
			return await this.invoiceRepository.find({
				where: {
					create_at: Raw(
						(alias) => `CAST(${ alias } as DATE) BETWEEN CAST(${ from } as DATE) AND CAST(${ to } as DATE)`
					)
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

	async getAllInvoiceWithDeleted (
		intervalDto: IntervalDateDto,
		paginationDto: PaginationDto
	): Promise<Pagination<InvoiceEntity>> 
	{
		const { to, from } = intervalDto;
		const { page, limit } = paginationDto;
		const options: IPaginationOptions = {
			page: page || 1,
			limit: limit || 5
		};

		if (from && to) {
			return await paginate(this.invoiceRepository, options, {
				where: {
					create_at: Raw(
						(alias) => `CAST(${ alias } as DATE) BETWEEN CAST(${ from } as DATE) AND CAST(${ to } as DATE)`
					)
				},
				order: {
					create_at: "DESC"
				},
				withDeleted: true
			});
		}

		return await paginate(this.invoiceRepository, options, {
			order: {
				create_at: "DESC"
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
		return await this.invoiceRepository.findOneBy({ id });
	}

	async getInvoiceByIdWithDeleted (id: string): Promise<InvoiceEntity | null> {
		return await this.invoiceRepository.findOne({ 
			where: { id },
			withDeleted: true
		});
	}

	// RESTORE
	async restore (id: string): Promise<any> {
		return await this.invoiceRepository.restore(id);
	}
}
