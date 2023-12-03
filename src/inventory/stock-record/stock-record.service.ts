import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Mode, StockRecordEntity } from './entity/stock-record.entity';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { ProductEntity } from 'src/product/product/entity/product.entity';

@Injectable()
export class StockRecordService {
	constructor (
		@InjectRepository(StockRecordEntity)
		private readonly stockRecordRepository: Repository<StockRecordEntity>
	) {}

	// CREATE
	async addStockRecord (
		author: AdminEntity,
		product: ProductEntity,
		mode: Mode,
		value: string
	): Promise<StockRecordEntity>
	{
		const newStockRecord: StockRecordEntity = await this.stockRecordRepository.create({
			mode,
			value,
			author,
			product
		});

		return await this.stockRecordRepository.save(newStockRecord);
	}
}
