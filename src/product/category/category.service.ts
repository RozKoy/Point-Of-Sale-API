import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { NameDto } from './dto';
import { CategoryEntity } from './entity/category.entity';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';

@Injectable()
export class CategoryService {
	constructor (
		@InjectRepository(CategoryEntity)
		private readonly categoryRepository: Repository<CategoryEntity>
	) {}

	// CREATE
	async createCategory (author: AdminEntity, nameDto: NameDto): Promise<CategoryEntity> {
		const newCategory: CategoryEntity = await this.categoryRepository.create({
			...nameDto,
			author
		});

		return await this.categoryRepository.save(newCategory);
	}

	// READ
	async getAllCategory (): Promise<CategoryEntity[]> {
		return await this.categoryRepository.find();
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
