import {
	paginate,
	Pagination,
	IPaginationOptions
} from 'nestjs-typeorm-paginate';
import { Like, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CategoryEntity } from './entity/category.entity';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { FilterDto } from 'src/controller/product-controller/dto';

@Injectable()
export class CategoryService {
	constructor (
		@InjectRepository(CategoryEntity)
		private readonly categoryRepository: Repository<CategoryEntity>
	) {}

	// CREATE
	async createCategory (author: AdminEntity, name: string): Promise<CategoryEntity> {
		const newCategory: CategoryEntity = await this.categoryRepository.create({
			name,
			author
		});

		return await this.categoryRepository.save(newCategory);
	}

	// READ
	async getPaginationCategory (filterDto: FilterDto): Promise<Pagination<CategoryEntity>> {
		const { page, limit, search } = filterDto;
		const options: IPaginationOptions = {
			page: page || 1,
			limit: limit || 5
		};

		if (search) {
			return await paginate<CategoryEntity>(this.categoryRepository, options, {
				where: { name: Like(`%${ search }%`) },
				order: { update_at: 'DESC' }
			});
		}

		return await paginate<CategoryEntity>(this.categoryRepository, options, {
			order: { update_at: 'DESC' }
		});
	}

	async getAllCategory (): Promise<CategoryEntity[]> {
		return await this.categoryRepository.find({
			order: { update_at: 'DESC' }
		});
	}

	async getCategoryById (id: string): Promise<CategoryEntity | null> {
		return await this.categoryRepository.findOneBy({ id });
	}

	async getTrashedCategoryById (id: string): Promise<CategoryEntity | null> {
		return await this.categoryRepository.findOne({ where: { id }, withDeleted: true });
	}

	async getCategoryByName (name: string): Promise<CategoryEntity | null> {
		return await this.categoryRepository.findOneBy({ name });
	}

	async getTrashedCategoryByName (name: string): Promise<CategoryEntity | null> {
		return await this.categoryRepository.findOne({ where: { name }, withDeleted: true });
	}

	// UPDATE
	async updateCategory (id: string, author: AdminEntity): Promise<CategoryEntity> {
		const category: CategoryEntity = await this.categoryRepository.findOneBy({ id });

		category.author = author;

		return await this.categoryRepository.save(category);
	}

	// DELETE
	async deleteCategory (id: string): Promise<any> {
		return await this.categoryRepository.softDelete(id);
	}

	// RESTORE
	async restoreCategory (id: string): Promise<any> {
		return await this.categoryRepository.restore(id);
	}
}
