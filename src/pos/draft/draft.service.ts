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

import { InvoiceDraftEntity } from './entity/draft.entity';
import { CashierEntity } from 'src/user/cashier/entity/cashier.entity';

import { PaginationDto } from 'src/controller/pos-controller/dto';

@Injectable()
export class DraftService {
	constructor (
		@InjectRepository(InvoiceDraftEntity)
		private readonly invoiceDraftRepository: Repository<InvoiceDraftEntity>
	) {}

	// READ
	async getDraftById (
		id: string,
		cashier: CashierEntity
	): Promise<InvoiceDraftEntity | null>
	{
		return await this.invoiceDraftRepository.findOne({
			where: {
				id,
				cashier: Equal(cashier.id)
			}
		});
	}

	async getAllDraftPaginationWithDeleted (
		cashier: CashierEntity,
		paginationDto: PaginationDto
	): Promise<Pagination<InvoiceDraftEntity>>
	{
		const { page, limit } = paginationDto;
		const options: IPaginationOptions = {
			page: page || 1,
			limit: limit || 5
		};

		return await paginate(this.invoiceDraftRepository, options, {
			where: {
				cashier: Equal(cashier.id),
				create_at: Raw(
					(alias) => `CAST(${ alias } as DATE) = CAST(NOW() as DATE)`
				)
			},
			relations: {
				invoice: true
			},
			order: {
				create_at: 'DESC'
			},
			withDeleted: true
		})
	}

	async getAllDraftByCashierWithDeleted (
		cashier: CashierEntity
	): Promise<InvoiceDraftEntity[]> 
	{
		return await this.invoiceDraftRepository.find({
			where: {
				cashier: Equal(cashier.id),
				create_at: Raw(
					(alias) => `CAST(${ alias } as DATE) = CAST(NOW() as DATE)`
				)
			},
			relations: {
				invoice: true
			},
			order: {
				create_at: 'DESC'
			},
			withDeleted: true
		});
	}

	// DELETE
	async delete (id: string): Promise<any> {
		return await this.invoiceDraftRepository.softDelete(id);
	}
}
