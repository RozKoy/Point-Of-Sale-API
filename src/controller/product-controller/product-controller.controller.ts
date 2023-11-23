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
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import {
	IDDto, 
	FilterDto, 
	UnitNameDto,
	UnitUpdateDto,
	CategoryNameDto, 
	CategoryUpdateDto,
} from './dto';

import { 
	GetUser, 
	RESPONSE,
	RESPONSE_I,
	AdminGuard
} from 'src/utils';

import { UnitEntity } from 'src/product/unit/entity/unit.entity';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { CategoryEntity } from 'src/product/category/entity/category.entity';

import { UnitService } from 'src/product/unit/unit.service';
import { CategoryService } from 'src/product/category/category.service';

@ApiBearerAuth()
@ApiTags('Product')

@Controller('product')
export class ProductControllerController {
	constructor (
		@Inject('UNIT_SERVICE') private readonly unitService: UnitService,
		@Inject('CATEGORY_SERVICE') private readonly categoryService: CategoryService
	) {}

	/*--- UNIT ---*/

	async createUnit(author: AdminEntity, name: string): Promise<RESPONSE_I> {
		let id: string | null = null;
		let msg: string = 'Berhasil menambahkan unit';
		const unitExists: UnitEntity | null = await this.unitService.getTrashedUnitByName(name);

		if (unitExists && !unitExists?.delete_at) {
			throw new HttpException('Unit telah digunakan', HttpStatus.CONFLICT);
		} else if (unitExists && unitExists?.delete_at) {
			id = unitExists.id;
			msg = 'Berhasil mengembalikan unit';
			await this.unitService.restoreUnit(id);
			await this.unitService.updateUnit(id, author);
		} else {
			const newUnit: UnitEntity = await this.unitService.createUnit(author, name);
			id = newUnit.id;
		}

		if (id) {
			const unit: UnitEntity = await this.unitService.getUnitById(id);

			return RESPONSE(unit, msg, HttpStatus.CREATED);
		}

		return;
	}

	// CREATE - Add Unit
	@UseGuards(AdminGuard)
	@Post('/unit/add')
	async addUnit (
		@Body() nameDto: UnitNameDto, @GetUser() author: AdminEntity
	): Promise<RESPONSE_I> 
	{
		const { name } = nameDto;

		return await this.createUnit(author, name);
	}

	// READ - Get Unit with Search
	@UseGuards(AdminGuard)
	@Get('/unit/all')
	async getAllUnit (@Query() filterDto: FilterDto): Promise<RESPONSE_I> {
		const { search } = filterDto;
		let status: HttpStatus = HttpStatus.OK;
		let msg: string = 'Berhasil mendapatkan daftar unit';
		const unit: Pagination<UnitEntity> = await this.unitService.getAllUnit(filterDto);

		if (unit.items.length === 0) {
			msg = 'Daftar unit kosong';
			status = HttpStatus.NO_CONTENT;
			if (search) {
				msg = 'Unit tidak ditemukan';
			}
		}

		return RESPONSE(unit, msg, status);
	}

	// UPDATE - Update Unit
	@UseGuards(AdminGuard)
	@Put('/unit/update')
	async updateUnit (
		@Body() updateDto: UnitUpdateDto, @GetUser() author: AdminEntity
	): Promise<RESPONSE_I> 
	{
		const { id, name } = updateDto;

		const unitExists: UnitEntity | null = await this.unitService.getUnitById(id);

		if (!unitExists) {
			throw new HttpException('Unit tidak dapat ditemukan', HttpStatus.NOT_FOUND);
		}

		if (unitExists.name === name) {
			throw new HttpException('Unit tidak ada perubahan', HttpStatus.BAD_REQUEST);
		}

		await this.unitService.updateUnit(id, author);
		await this.unitService.deleteUnit(id);

		return this.createUnit(author, name);
	}

	// DELETE - Delete Unit
	@UseGuards(AdminGuard)
	@Delete('/unit/delete')
	async deleteUnit (
		@Body() idDto: IDDto, @GetUser() author: AdminEntity
	): Promise<RESPONSE_I> 
	{
		const { id } = idDto;
		const unitExists: UnitEntity | null = await this.unitService.getUnitById(id);

		if (unitExists) {
			const response: any = await this.unitService.deleteUnit(id);

			return RESPONSE(response, 'Berhasil menghapus unit', HttpStatus.OK);
		}

		throw new HttpException('Unit tidak dapat ditemukan', HttpStatus.NOT_FOUND);
	}

	/*--- CATEGORY ---*/

	async createCategory (author: AdminEntity, name: string): Promise<RESPONSE_I> {
		let id: string | null = null;
		let msg: string = 'Berhasil menambahkan kategori';
		const categoryExists: CategoryEntity | null = await this.categoryService.getTrashedCategoryByName(name);

		if (categoryExists && !categoryExists?.delete_at) {
			throw new HttpException('Kategori telah digunakan', HttpStatus.CONFLICT);
		} else if (categoryExists && categoryExists?.delete_at) {
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
	async getPaginationCategory (@Query() filterDto: FilterDto): Promise<RESPONSE_I> {
		const { search } = filterDto;
		let status: HttpStatus = HttpStatus.OK;
		let msg: string = 'Berhasil mendapatkan daftar kategori';
		const categories: Pagination<CategoryEntity> = await this.categoryService.getPaginationCategory(filterDto);

		if (categories.items.length === 0) {
			msg = 'Daftar kategori kosong';
			status = HttpStatus.NO_CONTENT;
			if (search) {
				msg = 'Kategori tidak ditemukan';
			}
		}

		return RESPONSE(categories, msg, status);
	}

	// READ - Get Category List
	@UseGuards(AdminGuard)
	@Get('/category/list')
	async getAllCategory (): Promise<RESPONSE_I> {
		let status: HttpStatus = HttpStatus.OK;
		let msg: string = 'Berhasil mendapatkan daftar kategori';
		const categories: CategoryEntity[] = await this.categoryService.getAllCategory();

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
