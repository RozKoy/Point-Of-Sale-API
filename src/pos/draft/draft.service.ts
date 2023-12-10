import { 
	Raw,
	Equal,
	Repository 
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { InvoiceDraftEntity } from './entity/draft.entity';
import { CashierEntity } from 'src/user/cashier/entity/cashier.entity';

@Injectable()
export class DraftService {
	constructor (
		@InjectRepository(InvoiceDraftEntity)
		private readonly invoiceDraftRepository: Repository<InvoiceDraftEntity>
	) {}

	// READ
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
}
