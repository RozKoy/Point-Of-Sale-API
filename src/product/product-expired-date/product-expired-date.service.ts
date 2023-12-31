import { 
	Raw, 
	Equal,
	Repository 
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { ProductEntity } from 'src/product/product/entity/product.entity';
import { ProductExpiredDateEntity } from './entity/product-expired-date.entity';

@Injectable()
export class ProductExpiredDateService {
	constructor (
		@InjectRepository(ProductExpiredDateEntity)
		private readonly expiredDateRespository: Repository<ProductExpiredDateEntity>
	) {}

	// CREATE
	async createExpiredDate (
		author: AdminEntity, 
		product: ProductEntity, 
		expired_at: Date
	): Promise<ProductExpiredDateEntity>
	{
		const newExpiredDate: ProductExpiredDateEntity = await this.expiredDateRespository.create({
			author,
			product,
			expired_at
		});

		return await this.expiredDateRespository.save(newExpiredDate);
	}

	// READ
	async getExpiredAtByProduct (
		product: ProductEntity
	): Promise<ProductExpiredDateEntity[]>
	{
		return await this.expiredDateRespository.find({ 
			where: {
				product: Equal(product.id) 
			},
			order: {
				expired_at: "DESC"
			}
		});
	}

	async getExpiredAtByProductAndTime (
		product: ProductEntity
	): Promise<ProductExpiredDateEntity[]> {
		return await this.expiredDateRespository.find({
			where: { 
				product: Equal(product.id),
				expired_at: Raw(
					(alias) => `${ alias } BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 20 DAY)`
				) 
			},
			relations: {
				product: true
			},
			order: {
				expired_at: "DESC"
			}
		});
	}

	async getExpiredAtByProductTime (
		product: ProductEntity,
		date: Date
	): Promise<ProductExpiredDateEntity | null>
	{
		return await this.expiredDateRespository.findOne({
			where: {
				product: Equal(product.id),
				expired_at: date
			}
		});
	}

	// UPDATE
	async updateExpiredAt (
		id: string,
		author: AdminEntity
	): Promise<ProductExpiredDateEntity>
	{
		const expiredDate: ProductExpiredDateEntity = await this.expiredDateRespository.findOneBy({ id });

		expiredDate.author = author;

		return await this.expiredDateRespository.save(expiredDate);
	}

	// DELETE
	async delete (id: string): Promise<any> {
		return await this.expiredDateRespository.softDelete(id);
	}

	async deleteExpiredAtByTime (): Promise<void> {
		const expiredDate: ProductExpiredDateEntity[] = await this.expiredDateRespository.findBy({
			expired_at: Raw((alias) => `${ alias } <= NOW()`)
		});

		for (let temp of expiredDate) {
			await this.expiredDateRespository.softDelete(temp.id);
		}
	}
}
