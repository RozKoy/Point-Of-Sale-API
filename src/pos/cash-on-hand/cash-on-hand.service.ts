import { 
	Raw, 
	Equal, 
	Repository 
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CashOnHandEntity } from './entity/cash-on-hand.entity';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { CashierEntity } from 'src/user/cashier/entity/cashier.entity';

@Injectable()
export class CashOnHandService {
	constructor (
		@InjectRepository(CashOnHandEntity)
		private readonly cashOnHandRepository: Repository<CashOnHandEntity>
	) {}

	// CREATE
	async addCashOnHand (
		cashier: CashierEntity,
		cash_on_hand: string
	): Promise<CashOnHandEntity>
	{
		const newCashOnHand: CashOnHandEntity = await this.cashOnHandRepository.create({
			cashier,
			cash_on_hand
		});

		return await this.cashOnHandRepository.save(newCashOnHand);
	}

	// READ
	async getCashOnHandByCashier (
		cashier: CashierEntity
	): Promise<CashOnHandEntity | null>
	{
		return await this.cashOnHandRepository.findOne({
			where: { 
				cashier: Equal(cashier.id),
				create_at: Raw(
					(alias) => `CAST(${ alias } as DATE) = CAST(NOW() as DATE)`
				)
			}
		});
	}
}
