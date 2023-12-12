import {
	paginate,
	Pagination,
	IPaginationOptions
} from 'nestjs-typeorm-paginate';
import { Like, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProductEntity } from './entity/product.entity';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { FilterDto } from 'src/controller/product-group-controller/dto';

@Injectable()
export class ProductService {
	constructor (
		@InjectRepository(ProductEntity)
		private readonly productRepository: Repository<ProductEntity>
	) {}

	// CREATE
	async createProduct (
		author: AdminEntity, 
		name: string, 
		image: string
	): Promise<ProductEntity> 
	{
		const newProduct: ProductEntity = await this.productRepository.create({
			name,
			image,
			author
		});

		return await this.productRepository.save(newProduct);
	}

	// READ
	async getAllProduct (): Promise<ProductEntity[]> {
		return await this.productRepository.find({
			order: { update_at: 'DESC' }
		});
	}

	async getAllProductOrderByCount (): Promise<ProductEntity[]> {
		return await this.productRepository.find({
			order: {
				count: 'DESC'
			}
		});
	}

	async getAllProductWithSearch (search: string): Promise<ProductEntity[]> {
		return await this.productRepository.find({
			where: { 
				name: Like(`%${ search }%`) 
			},
			order: { 
				count: 'DESC' 
			}
		});
	}

	async getAllProductWithPagination (filter: FilterDto): Promise<Pagination<ProductEntity>> {
		const { page, limit, search } = filter;
		const options: IPaginationOptions = {
			page: page || 1,
			limit: limit || 5
		};

		if (search) {
			return await paginate(this.productRepository, options, {
				where: { name: Like(`%${ search }%`) },
				order: { update_at: 'DESC' }
			});
		}

		return await paginate(this.productRepository, options, {
			order: { update_at: 'DESC' }
		});
	}

	async getProductById (id: string): Promise<ProductEntity | null> {
		return await this.productRepository.findOneBy({ id });
	}

	async getTrashedProductById (id: string): Promise<ProductEntity | null> {
		return await this.productRepository.findOne({ where: { id }, withDeleted: true });
	}

	async getProductByName (name: string): Promise<ProductEntity | null> {
		return await this.productRepository.findOneBy({ name });
	}

	async getTrashedProductByName (name: string): Promise<ProductEntity | null> {
		return await this.productRepository.findOne({ where: { name }, withDeleted: true });
	}

	// UPDATE
	async updateProduct (
		id: string, 
		author: AdminEntity, 
		image?: string
	): Promise<ProductEntity> 
	{
		const product: ProductEntity = await this.productRepository.findOneBy({ id });

		product.author = author;
		product.image = image ? image : product.image;

		return await this.productRepository.save(product);
	}

	async plusCountProduct (
		id: string,
		count: number
	): Promise<ProductEntity>
	{
		const product: ProductEntity = await this.productRepository.findOneBy({ id });

		if (product.count >= 1000000000) {
			product.count = 10000;
		} else {
			product.count += count;
		}

		return await this.productRepository.save(product);
	}

	// DELETE
	async deleteProduct (id: string): Promise<any> {
		return await this.productRepository.softDelete(id);
	}

	// RESTORE 
	async retoreProduct (id: string): Promise<any> {
		return await this.productRepository.restore(id);
	}
}
