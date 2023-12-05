import {
	Get,
	Body, 
	Post,
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
	ProductDto 
} from './dto';

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
import { ProductPriceEntity } from 'src/product-group/product-price/entity/product-price.entity';
import { ProductCategoryEntity } from 'src/product-group/product-category/entity/product-category.entity';
import { ProductExpiredDateEntity } from 'src/product/product-expired-date/entity/product-expired-date.entity';

import { UnitService } from 'src/product/unit/unit.service';
import { StockService } from 'src/inventory/stock/stock.service';
import { ProductService } from 'src/product/product/product.service';
import { CategoryService } from 'src/product/category/category.service';
import { ProductUnitService } from 'src/product-group/product-unit/product-unit.service';
import { ProductPriceService } from 'src/product-group/product-price/product-price.service';
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
		@Inject('PRODUCT_PRICE_SERVICE') 
		private readonly productPriceService: ProductPriceService,
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

	// CREATE - Add Product
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
			this.throwBadRequest(!temp?.price, 'Harga produk tidak valid');
			const stock: number = +temp.stock;
			const price: number = +temp.price;
			this.throwBadRequest(stock < 0 || !Number.isInteger(stock), 'Stock produk harus diatas 0 dan bilangan bulat');
			this.throwBadRequest(price < 0 || !Number.isInteger(price), 'Harga produk harus diatas 0 dan bilangan bulat');
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

		// GROUP (UNIT, PRICE, STOCK)
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

			// PRODUCT PRICE GROUP
			let productPriceExists: ProductPriceEntity | null = await this.productPriceService.getProductPriceByUnitWithDeleted(productUnitExists);
			if (!productPriceExists) {
				await this.productPriceService.createProductPrice(author, productUnitExists, temp.price);
			} else if (productPriceExists) {
				const id: string = productPriceExists.id;
				if (productPriceExists.delete_at) {
					await this.productPriceService.restore(id);
				}
				await this.productPriceService.update(id, author, temp.price);
			}

			// PRODUCT STOCK GROUP
			let productStockExists: StockEntity | null = await this.stockService.getStockByUnitWithDeleted(productUnitExists);
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

	// READ - Get Product and Category
	@UseGuards(AdminGuard)
	@Get('/all')
	async getProductAndCategory (@Query() filterDto: FilterDto): Promise<RESPONSE_I> {
		const { search } = filterDto;
		let status: HttpStatus = HttpStatus.OK;
		let msg: string = 'Berhasil mendapatkan data produk dan kategori';
		const product: Pagination<any> = await this.productService.getAllProductWithPagination(filterDto);

		if (product.items.length > 0) {
			const productCategories: any[] = await this.productCategoryService.getAll();

			for (const temp of product.items) {
				temp.categories = [];
				for (let index = 0; index < productCategories.length; index++) {
					if (temp.id === productCategories[index].product.id) {
						temp.categories.push(productCategories[index].category);
						productCategories.splice(index, 1);
						index--;
					}
				}
				if (temp.categories.length === 0) {
					temp.categories.push({ name: 'Tidak Terkategori' });
				}
			}
		} else {
			status = HttpStatus.NO_CONTENT;
			msg = 'Daftar produk kosong';
			if (search) {
				msg = 'Produk atau kategori tidak ditemukan';
			}
		}

		return RESPONSE(product, msg, status);
	}

	// READ - Get One Product Detail
	@UseGuards(AdminGuard)
	@Post('/one')
	async getOneProductDetail (@Body() idDto: IDDto): Promise<RESPONSE_I> {
		const { id } = idDto;
		const product: any = await this.productService.getProductById(id);

		if (product) {
			const categories: ProductCategoryEntity[] = await this.productCategoryService.getProductCategoryByProduct(product);
			const expired_at: ProductExpiredDateEntity[] = await this.productExpiredDateService.getExpiredAtByProduct(product);
			const unit: ProductUnitEntity[] = await this.productUnitService.getProductUnitByProduct(product);
			product.category = [];
			for (let temp of categories) {
				product.category.push(temp.category);
			}
			product.group = [];
			for (let temp of unit) {
				const stock: StockEntity | null = await this.stockService.getStockByUnit(temp);
				const price: ProductPriceEntity | null = await this.productPriceService.getProductPriceByUnit(temp);

				if (stock && price) {
					const group: any = {
						price,
						stock,
						id: temp.id,
						unit: temp.unit,
					}
					product.group.push(group);
				}
			}

			return RESPONSE(product, 'Berhasil mendapatkan detail produk', HttpStatus.OK);
		}

		this.throwNotFound(true, 'Produk tidak dapat ditemukan');
	}

	// DELETE - Delete Product Group
	@UseGuards(AdminGuard)
	@Delete('/delete')
	async deleteProductGroup (
		@Body() idDto: IDDto,
		@GetUser() author: AdminEntity
	): Promise<RESPONSE_I>
	{
		const { id } = idDto;

		// Get Product
		const product: ProductEntity | null = await this.productService.getProductById(id);
		this.throwNotFound(!product, 'Produk tidak dapat ditemukan');

		// Get Category Lists
		const categories: ProductCategoryEntity[] = await this.productCategoryService.getProductCategoryByProduct(product);

		// Get Expired Lists
		const expired_at: ProductExpiredDateEntity[] = await this.productExpiredDateService.getExpiredAtByProduct(product);

		// Get Unit of Product
		const productUnit: ProductUnitEntity[] = await this.productUnitService.getProductUnitByProduct(product);

		for (let unit of productUnit) {
			// Get Price of Product Unit
			const productPrice: ProductPriceEntity | null = await this.productPriceService.getProductPriceByUnit(unit);
			this.throwNotFound(!productPrice, 'Harga produk untuk satuan ' + unit.unit.name + ' tidak dapat ditemukan');

			// Get Stock of Product Unit
			const productStock: StockEntity | null = await this.stockService.getStockByUnit(unit);
			this.throwNotFound(!productStock, 'Stok produk untuk satuan ' + unit.unit.name + ' tidak dapat ditemukan');
		}

		// ACTION to DELETE

		// Group
		for (let unit of productUnit) {
			const productPrice: ProductPriceEntity | null = await this.productPriceService.getProductPriceByUnit(unit);
			await this.productPriceService.update(productPrice.id, author);
			await this.productPriceService.delete(productPrice.id);

			const productStock: StockEntity | null = await this.stockService.getStockByUnit(unit);
			await this.stockService.update(productStock.id, author);
			await this.stockService.delete(productStock.id);

			await this.productUnitService.updateProductUnit(unit.id, author);
			await this.productUnitService.delete(unit.id);
		}

		// Expired Date
		for (let temp of expired_at) {
			await this.productExpiredDateService.updateExpiredAt(temp.id, author);
			await this.productExpiredDateService.delete(temp.id);
		}

		// Category
		for (let temp of categories) {
			await this.productCategoryService.updateProductCategory(temp.id, author);
			await this.productCategoryService.deleteProductCategory(temp.id);
		}

		// Product
		await this.productService.updateProduct(product.id, author);
		await this.productService.deleteProduct(product.id);

		return RESPONSE(true, 'Berhasil menghapus produk ' + product.name, HttpStatus.OK);
	}
}
