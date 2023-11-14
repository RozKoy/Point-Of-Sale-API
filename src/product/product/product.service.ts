import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProductEntity } from './entity/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';

@Injectable()
export class ProductService {
	constructor (
		@InjectRepository(ProductEntity)
		private readonly productRepository: Repository<ProductEntity>
	) {}

	// CREATE
	async createProduct (
		author: AdminEntity, createProductDto: CreateProductDto
	): Promise<ProductEntity> 
	{
		const newProduct: ProductEntity = await this.productRepository.create({
			...createProductDto,
			author
		});

		return await this.productRepository.save(newProduct);
	}

	// READ
	async getAllProduct (): Promise<ProductEntity[]> {
		return await this.productRepository.find();
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
		id: string, author: AdminEntity, updateProductDto: UpdateProductDto
	): Promise<ProductEntity> 
	{
		const { name, image } = updateProductDto;
		const product: ProductEntity = await this.productRepository.findOneBy({ id });

		product.author = author;
		product.name = name ? name : product.name;
		product.image = image ? image : product.image;

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
