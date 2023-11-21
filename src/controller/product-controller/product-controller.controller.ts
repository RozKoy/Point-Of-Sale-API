import { 
	Get,
	Put,
	Post,
	Body,
	Query,
	Delete, 
	Inject,
	UseGuards,
	Controller,
	HttpStatus,
	HttpException
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import {
	IDDto, 
	CategoryNameDto, 
	CategoryUpdateDto,
	CategorySearchDto 
} from './dto';

import { 
	GetUser, 
	RESPONSE,
	RESPONSE_I,
	AdminGuard
} from 'src/utils';

import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { CategoryEntity } from 'src/product/category/entity/category.entity';

import { CategoryService } from 'src/product/category/category.service';

@ApiBearerAuth()
@ApiTags('Product')

@Controller('product')
export class ProductControllerController {
	constructor (
		@Inject('CATEGORY_SERVICE') private readonly categoryService: CategoryService
	) {}

	/* CATEGORY */

	async createCategory (author: AdminEntity, name: string): Promise<RESPONSE_I> {
		let id: string | null = null;
		let msg: string = 'Berhasil menambahkan kategori';
		const categoryExists: CategoryEntity | null = await this.categoryService.getTrashedCategoryByName(name);

		if (categoryExists && !categoryExists.delete_at) {
			throw new HttpException('Kategori telah digunakan', HttpStatus.CONFLICT);
		} else if (categoryExists && categoryExists.delete_at) {
			id = categoryExists.id;
			msg = 'Berhasil mengembalikan kategori';
			await this.categoryService.restoreCategory(id);
			await this.categoryService.updateCategory(id, author);
		} else {
			const newCategory: CategoryEntity = await this.categoryService.createCategory(author, name);
			id = newCategory.id;
		}

		if (id) {
			const category: CategoryEntity = await this.categoryService.getCategoryById(id);

			return RESPONSE(category, msg, HttpStatus.CREATED);
		}
		return;
	}

	// CREATE - Add Category
	@UseGuards(AdminGuard)
	@Post('/category/add')
	async addCategory (@Body() nameDto: CategoryNameDto, @GetUser() author: AdminEntity): Promise<RESPONSE_I> {
		const { name } = nameDto;

		return await this.createCategory(author, name);
	}

	// READ - Get Category with Search
	@UseGuards(AdminGuard)
	@Get('/category/all')
	async getAllCategory (@Query() searchDto: CategorySearchDto): Promise<RESPONSE_I> {
		const { search } = searchDto;
		let status: HttpStatus = HttpStatus.OK;
		let msg: string = 'Berhasil mendapatkan daftar kategori';
		const categories: CategoryEntity[] = await this.categoryService.getAllCategory(search);

		if (categories.length === 0) {
			msg = 'Daftar kategori kosong';
			status = HttpStatus.NO_CONTENT;
		}

		return RESPONSE(categories, msg, status);
	}

	// UPDATE - Update Category
	@UseGuards(AdminGuard)
	@Put('/category/update')
	async updateCategory (
		@Body() updateDto: CategoryUpdateDto, @GetUser() author: AdminEntity
	): Promise<RESPONSE_I> 
	{
		const { id, name } = updateDto;

		const categoryExists: CategoryEntity | null = await this.categoryService.getCategoryById(id);

		if (!categoryExists) {
			throw new HttpException('Kategori tidak dapat ditemukan', HttpStatus.NOT_FOUND);
		}

		if (categoryExists.name === name) {
			throw new HttpException('Kategori tidak ada perubahan', HttpStatus.BAD_REQUEST);
		}

		await this.categoryService.updateCategory(id, author);
		await this.categoryService.deleteCategory(id);

		return this.createCategory(author, name);
	}

	// DELETE - Delete Category
	@UseGuards(AdminGuard)
	@Delete('/category/delete')
	async deleteCategory (
		@Body() idDto: IDDto, @GetUser() author: AdminEntity
	): Promise<RESPONSE_I> 
	{
		const { id } = idDto;
		const categoryExists: CategoryEntity | null = await this.categoryService.getCategoryById(id);

		if (categoryExists) {
			const response: any = await this.categoryService.deleteCategory(id);

			return RESPONSE(response, 'Berhasil menghapus kategori', HttpStatus.OK);
		}

		throw new HttpException('Kategori tidak dapat ditemukan', HttpStatus.NOT_FOUND);
	}
}
