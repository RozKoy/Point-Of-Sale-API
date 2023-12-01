import { Equal, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProductUnitEntity } from './entity/product-unit.entity';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { UnitEntity } from 'src/product/unit/entity/unit.entity';
import { ProductEntity } from 'src/product/product/entity/product.entity';

@Injectable()
export class ProductUnitService {
	constructor (
		@InjectRepository(ProductUnitEntity) 
		private readonly productUnitRepository: Repository<ProductUnitEntity>
	) {}

	// CREATE
	async createProductUnit (
		author: AdminEntity,
		product: ProductEntity,
		unit: UnitEntity,
	): Promise<ProductUnitEntity>
	{
		const newProductUnit: ProductUnitEntity = await this.productUnitRepository.create({
			unit,
			author,
			product
		});

		return await this.productUnitRepository.save(newProductUnit);
	}

	// READ
	async getProductUnitById (id: string): Promise<ProductUnitEntity | null> {
		return await this.productUnitRepository.findOneBy({ id });
	}

	async getProductUnitByProductAndUnit (
		product: ProductEntity,
		unit: UnitEntity
	): Promise<ProductUnitEntity | null>
	{
		return await this.productUnitRepository.findOne({
			where: {
				unit: Equal(unit.id),
				product: Equal(product.id)
			},
			withDeleted: true
		});
	}

	async getProductUnitByProduct (
		product: ProductEntity
	): Promise<ProductUnitEntity[]>
	{
		return await this.productUnitRepository.find({
			where: {
				product: Equal(product.id)
			}, 
			relations: { 
				unit: true 
			}
		});
	}

	// UPDATE
	async updateProductUnit (id: string, author: AdminEntity): Promise<ProductUnitEntity> {
		const productUnit: ProductUnitEntity = await this.productUnitRepository.findOneBy({ id });

		productUnit.author = author;

		return await this.productUnitRepository.save(productUnit);
	}

	// RESTORE
	async restoreProductUnit (id: string): Promise<any> {
		return await this.productUnitRepository.restore(id);
	}
}
