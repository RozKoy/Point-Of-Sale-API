import {
	Body, 
	Post,
	Inject,
	UseGuards,
	Controller,
	HttpStatus,
	HttpException
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { ProductDto } from './dto';

import { 
	GetUser, 
	RESPONSE,
	RESPONSE_I,
	AdminGuard 
} from 'src/utils';

import { UnitEntity } from 'src/product/unit/entity/unit.entity';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { StockEntity } from 'src/inventory/stock/entity/stock.entity';
import { ProductEntity } from 'src/product/product/entity/product.entity';
import { CategoryEntity } from 'src/product/category/entity/category.entity';
import { ProductUnitEntity } from 'src/product-group/product-unit/entity/product-unit.entity';
import { ProductPrizeEntity } from 'src/product-group/product-prize/entity/product-prize.entity';
import { ProductCategoryEntity } from 'src/product-group/product-category/entity/product-category.entity';

import { UnitService } from 'src/product/unit/unit.service';
import { StockService } from 'src/inventory/stock/stock.service';
import { ProductService } from 'src/product/product/product.service';
import { CategoryService } from 'src/product/category/category.service';
import { ProductUnitService } from 'src/product-group/product-unit/product-unit.service';
import { ProductPrizeService } from 'src/product-group/product-prize/product-prize.service';
import { ProductCategoryService } from 'src/product-group/product-category/product-category.service';
import { ProductExpiredDateService } from 'src/product/product-expired-date/product-expired-date.service';

@ApiBearerAuth()
@ApiTags('Product Group')

@Controller('product/group')
export class ProductGroupControllerController {
	constructor (
		@Inject('UNIT_SERVICE') private readonly unitService: UnitService,
		@Inject('STOCK_SERVICE') private readonly stockService: StockService,
		@Inject('PRODUCT_SERVICE') private readonly productService: ProductService,
		@Inject('CATEGORY_SERVICE') private readonly categoryService: CategoryService,
		@Inject('PRODUCT_UNIT_SERVICE')
		private readonly productUnitService: ProductUnitService,
		@Inject('PRODUCT_PRIZE_SERVICE') 
		private readonly productPrizeService: ProductPrizeService,
		@Inject('PRODUCT_CATEGORY_SERVICE')
		private readonly productCategoryService: ProductCategoryService,
		@Inject('PRODUCT_EXPIRED_DATE_SERVICE')
		private readonly productExpiredDateService: ProductExpiredDateService
	) {}

	throwConflict (condition: boolean, msg: string): void {
		if (condition) throw new HttpException(msg, HttpStatus.CONFLICT);
	}

	throwBadRequest (condition: boolean, msg: string): void {
		if (condition) throw new HttpException(msg, HttpStatus.BAD_REQUEST);
	}

	throwNotFound (condition: boolean, msg: string): void {
		if (condition) throw new HttpException(msg, HttpStatus.NOT_FOUND);
	}

	@UseGuards(AdminGuard)
	@Post('/add')
	async addProduct (
		@Body() productDto: ProductDto, @GetUser() author: AdminEntity
	): Promise<RESPONSE_I>
	{
		const { name, categories, expired_at, image, group } = productDto;

		/*--- CHECK ALL INPUT ---*/

		// CHECK PRODUCT
		const productExists: ProductEntity | null = await this.productService.getTrashedProductByName(name);
		this.throwConflict(productExists && !productExists?.delete_at, 'Nama produk telah digunakan');

		// CHECK CATEGORY
		const categoryArray: CategoryEntity[] = [];
		if (categories && categories?.length > 0) {
			for (let temp of categories) {
				this.throwBadRequest(typeof(temp) !== 'string', 'Array kategori harus berisi string');
				const categoryExists: CategoryEntity | null = await this.categoryService.getCategoryById(temp);
				this.throwNotFound(!categoryExists, 'Kategori tidak dapat ditemukan');
				this.throwBadRequest(categoryArray.includes(categoryExists), 'Tidak boleh ada kategori yang sama dalam satu produk');
				categoryArray.push(categoryExists);
			}
		}

		// CHECK GROUP
		this.throwBadRequest(group?.length === 0, 'Daftar grup tidak boleh kosong');
		const unitArray: string[] = [];
		for (let temp of group) {
			this.throwBadRequest(!temp?.unit, 'Unit produk tidak valid');
			this.throwBadRequest(!temp?.stock, 'Stok produk tidak valid');
			this.throwBadRequest(!temp?.prize, 'Harga produk tidak valid');
			const stock: number = +temp.stock;
			const prize: number = +temp.prize;
			this.throwBadRequest(stock < 0 || !Number.isInteger(stock), 'Stock produk harus diatas 0 dan bilangan bulat');
			this.throwBadRequest(prize < 0 || !Number.isInteger(prize), 'Harga produk harus diatas 0 dan bilangan bulat');
			const unitExists: UnitEntity | null = await this.unitService.getUnitById(temp.unit);
			this.throwNotFound(!unitExists, 'Unit tidak dapat ditemukan');
			this.throwBadRequest(unitArray.includes(temp.unit), 'Tidak boleh ada unit yang sama dalam satu produk');
			unitArray.push(temp.unit);
		}

		/*--- PROCESS ALL ---*/

		// PRODUCT
		if (productExists && productExists?.delete_at) {
			const id: string = productExists.id;
			await this.productService.retoreProduct(id);
			await this.productService.updateProduct(id, author, image);
		} else {
			await this.productService.createProduct(author, name, image);
		}
		// GET NEW PRODUCT
		const product: ProductEntity | null = await this.productService.getProductByName(name);

		// CATEGORY
		for (let temp of categoryArray) {
			const productCategoryExists: ProductCategoryEntity | null = await this.productCategoryService.getProductCategoryByProductAndCategory(product, temp);
			if (productCategoryExists && productCategoryExists?.delete_at) {
				const id: string = productCategoryExists.id;
				await this.productCategoryService.restoreProductCategory(id);
				await this.productCategoryService.updateProductCategory(id, author);
			} else if (!productCategoryExists) {
				await this.productCategoryService.createProductCategory(author, product, temp);
			}
		}

		// EXPIRED DATE
		if (expired_at) {
			await this.productExpiredDateService.createExpiredDate(author, product, expired_at);
		}

		// GROUP (UNIT, PRIZE, STOCK)
		for (let temp of group) {
			const unit: UnitEntity = await this.unitService.getUnitById(temp.unit);

			// PRODUCT UNIT GROUP
			let productUnitExists: ProductUnitEntity | null = await this.productUnitService.getProductUnitByProductAndUnit(product, unit);
			if (!productUnitExists) {
				await this.productUnitService.createProductUnit(author, product, unit);
			} else if (productUnitExists?.delete_at) {
				const id: string = productExists.id;
				await this.productUnitService.restoreProductUnit(id);
				await this.productUnitService.updateProductUnit(id, author);
			}
			productUnitExists = await this.productUnitService.getProductUnitByProductAndUnit(product, unit);

			// PRODUCT PRIZE GROUP
			let productPrizeExists: ProductPrizeEntity | null = await this.productPrizeService.getProductPrizeByPrizeAndUnit(productUnitExists, temp.prize);
			if (!productPrizeExists) {
				await this.productPrizeService.createProductPrize(author, productUnitExists, temp.prize);
			} else if (productPrizeExists) {
				const id: string = productPrizeExists.id;
				if (productPrizeExists.delete_at) {
					await this.productPrizeService.restore(id);
				}
				await this.productPrizeService.update(id, author, temp.prize);
			}

			// PRODUCT STOCK GROUP
			let productStockExists: StockEntity | null = await this.stockService.getStockByUnit(productUnitExists);
			if (!productStockExists) {
				await this.stockService.createStock(author, productUnitExists, temp.stock);
			} else if (productStockExists) {
				const id: string = productStockExists.id;
				if (productStockExists.delete_at) {
					await this.stockService.restore(id);
				}
				await this.stockService.update(id, author, temp.stock);
			}
		}

		const newProduct: ProductEntity = await this.productService.getTrashedProductByName(name);

		return RESPONSE(newProduct, 'Berhasil menambah produk baru', HttpStatus.CREATED);
	}
}
