import { Equal, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { ProductCategoryEntity } from './entity/product-category.entity';
import { ProductEntity } from 'src/product/product/entity/product.entity';
import { CategoryEntity } from 'src/product/category/entity/category.entity';

@Injectable()
export class ProductCategoryService {
	constructor (
		@InjectRepository(ProductCategoryEntity)
		private readonly productCategoryRepository: Repository<ProductCategoryEntity>
	) {}

	// CREATE 
	async createProductCategory (
		author: AdminEntity,
		product: ProductEntity,
		category: CategoryEntity
	): Promise<ProductCategoryEntity>
	{
		const newProductCategory: ProductCategoryEntity = await this.productCategoryRepository.create({
			author,
			product,
			category
		});

		return await this.productCategoryRepository.save(newProductCategory);
	}

	// READ
	async getAll (): Promise<ProductCategoryEntity[]> {
		return await this.productCategoryRepository.find({
			relations: {
				product: true,
				category: true
			}
		});
	}
	async getProductCategoryByProduct (
		product: ProductEntity
	): Promise<ProductCategoryEntity[]>
	{
		return await this.productCategoryRepository.find({
			where: { product: Equal(product.id) }
		});
	}

	async getProductCategoryByProductAndCategory (
		product: ProductEntity,
		category: CategoryEntity
	): Promise<ProductCategoryEntity | null>
	{
		return await this.productCategoryRepository.findOne({
			where: { 
				product: Equal(product.id),
				category: Equal(category.id)
			},
			withDeleted: true
		});
	}

	// UPDATE
	async updateProductCategory (
		id: string,
		author: AdminEntity
	): Promise<ProductCategoryEntity>
	{
		const productCategory: ProductCategoryEntity = await this.productCategoryRepository.findOneBy({ id });

		productCategory.author = author;

		return await this.productCategoryRepository.save(productCategory);
	}

	// DELETE
	async deleteProductCategory (id: string): Promise<any> {
		return await this.productCategoryRepository.softDelete(id);
	}

	// RESTORE
	async restoreProductCategory (id: string): Promise<any> {
		return await this.productCategoryRepository.restore(id);
	}
}
