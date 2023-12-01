import { Equal, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { ProductPrizeEntity } from './entity/product-prize.entity';
import { ProductUnitEntity } from 'src/product-group/product-unit/entity/product-unit.entity';

@Injectable()
export class ProductPrizeService {
	constructor (
		@InjectRepository(ProductPrizeEntity)
		private readonly productPrizeRepository: Repository<ProductPrizeEntity>
	) {}

	// CREATE
	async createProductPrize (
		author: AdminEntity,
		unit: ProductUnitEntity,
		prize: string
	): Promise<ProductPrizeEntity>
	{
		const newProductPrize: ProductPrizeEntity = await this.productPrizeRepository.create({
			unit,
			prize,
			author
		});

		return await this.productPrizeRepository.save(newProductPrize);
	}

	// READ
	async getProductPrizeByUnitWithDeleted (
		unit: ProductUnitEntity
	): Promise<ProductPrizeEntity | null>
	{
		return await this.productPrizeRepository.findOne({
			where: {
				unit: Equal(unit.id)
			},
			withDeleted: true
		});
	}

	async getProductPrizeByUnit (
		unit: ProductUnitEntity
	): Promise<ProductPrizeEntity | null>
	{
		return await this.productPrizeRepository.findOne({
			where: {
				unit: Equal(unit.id)
			}
		});
	}

	// UPDATE
	async update (
		id: string,
		author: AdminEntity,
		prize?: string
	): Promise<ProductPrizeEntity>
	{
		const productPrize: ProductPrizeEntity = await this.productPrizeRepository.findOneBy({ id });

		productPrize.prize = prize ? prize : productPrize.prize;
		productPrize.author = author ? author : productPrize.author;

		return await this.productPrizeRepository.save(productPrize);
	}

	// RESTORE
	async restore (id: string): Promise<any> {
		return await this.productPrizeRepository.restore(id);
	}
}
