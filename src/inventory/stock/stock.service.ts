import { Equal, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { StockEntity } from './entity/stock.entity';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { ProductUnitEntity } from 'src/product-group/product-unit/entity/product-unit.entity';

@Injectable()
export class StockService {
	constructor (
		@InjectRepository(StockEntity) 
		private readonly stockRepository: Repository<StockEntity>
	) {}

	// CREATE
	async createStock (
		author: AdminEntity,
		unit: ProductUnitEntity,
		stock: string
	): Promise<StockEntity>
	{
		const newStock: StockEntity = await this.stockRepository.create({
			unit,
			stock,
			author
		});

		return await this.stockRepository.save(newStock);
	}

	// READ
	async getStockByUnit (unit: ProductUnitEntity): Promise<StockEntity | null> {
		return await this.stockRepository.findOne({
			where: {
				unit: Equal(unit.id)
			}
		});
	}

	async getStockByUnitWithDeleted (unit: ProductUnitEntity): Promise<StockEntity | null> {
		return await this.stockRepository.findOne({
			where: {
				unit: Equal(unit.id)
			},
			withDeleted: true
		})
	}

	// UPDATE
	async update (
		id: string,
		author: AdminEntity,
		stock?: string
	): Promise<StockEntity>
	{
		const productStock: StockEntity = await this.stockRepository.findOneBy({ id });

		productStock.stock = stock ? stock : productStock.stock;
		productStock.author = author ? author : productStock.author;

		return await this.stockRepository.save(productStock);
	}

	// DELETE
	async delete (id: string): Promise<any> {
		return await this.stockRepository.softDelete(id);
	}

	// RESTORE
	async restore (id: string): Promise<any> {
		return await this.stockRepository.restore(id);
	}
}
