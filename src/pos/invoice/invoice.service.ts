import { 
	Raw,
	Equal,
	Repository 
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { InvoiceEntity } from './entity/invoice.entity';
import { CashierEntity } from 'src/user/cashier/entity/cashier.entity';

@Injectable()
export class InvoiceService {
	constructor (
		@InjectRepository(InvoiceEntity)
		private readonly invoiceRepository: Repository<InvoiceEntity>
	) {}

	// READ
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
}
