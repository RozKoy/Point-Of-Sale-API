import { Equal, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { ProductPriceEntity } from './entity/product-price.entity';
import { ProductUnitEntity } from 'src/product-group/product-unit/entity/product-unit.entity';

@Injectable()
export class ProductPriceService {
	constructor (
		@InjectRepository(ProductPriceEntity)
		private readonly productPriceRepository: Repository<ProductPriceEntity>
	) {}

	// CREATE
	async createProductPrice (
		author: AdminEntity,
		unit: ProductUnitEntity,
		price: string
	): Promise<ProductPriceEntity>
	{
		const newProductPrice: ProductPriceEntity = await this.productPriceRepository.create({
			unit,
			price,
			author
		});

		return await this.productPriceRepository.save(newProductPrice);
	}

	// READ
	async getProductPriceByUnitWithDeleted (
		unit: ProductUnitEntity
	): Promise<ProductPriceEntity | null>
	{
		return await this.productPriceRepository.findOne({
			where: {
				unit: Equal(unit.id)
			},
			withDeleted: true
		});
	}

	async getProductPriceByUnit (
		unit: ProductUnitEntity
	): Promise<ProductPriceEntity | null>
	{
		return await this.productPriceRepository.findOne({
			where: {
				unit: Equal(unit.id)
			}
		});
	}

	// UPDATE
	async update (
		id: string,
		author: AdminEntity,
		price?: string
	): Promise<ProductPriceEntity>
	{
		const productPrice: ProductPriceEntity = await this.productPriceRepository.findOneBy({ id });

		productPrice.price = price ? price : productPrice.price;
		productPrice.author = author ? author : productPrice.author;

		return await this.productPriceRepository.save(productPrice);
	}

	// RESTORE
	async restore (id: string): Promise<any> {
		return await this.productPriceRepository.restore(id);
	}
}
