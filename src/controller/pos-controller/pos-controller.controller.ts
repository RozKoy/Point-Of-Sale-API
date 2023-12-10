import { 
	Get,
	Query,
	Inject,
	UseGuards,
	Controller,
	HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { 
	RESPONSE,
	RESPONSE_I,
	CashierGuard 
} from 'src/utils';

import { SearchDto } from './dto';

import { StockService } from 'src/inventory/stock/stock.service';
import { ProductService } from 'src/product/product/product.service';
import { ProductUnitService } from 'src/product-group/product-unit/product-unit.service';
import { ProductPriceService } from 'src/product-group/product-price/product-price.service';

import { StockEntity } from 'src/inventory/stock/entity/stock.entity';
import { ProductEntity } from 'src/product/product/entity/product.entity';
import { ProductUnitEntity } from 'src/product-group/product-unit/entity/product-unit.entity';
import { ProductPriceEntity } from 'src/product-group/product-price/entity/product-price.entity';

@ApiTags('POS')
@ApiBearerAuth()
@UseGuards(CashierGuard)

@Controller('pos')
export class PosControllerController {
	constructor (
		@Inject('STOCK_SERVICE') 
		private readonly stockService: StockService,
		@Inject('PRODUCT_SERVICE')
		private readonly productService: ProductService,
		@Inject('PRODUCT_UNIT_SERVICE')
		private readonly productUnitService: ProductUnitService,
		@Inject('PRODUCT_PRICE_SERVICE') 
		private readonly productPriceService: ProductPriceService
	) {}

	@Get('/product/all')
	async getAllProductWithSearch (
		@Query() searchDto: SearchDto
	): Promise<RESPONSE_I>
	{
		let products: any[] = [];
		let length: number = 0;
		const { search } = searchDto;
		let msg: string = 'Berhasil mendapatkan daftar produk';

		if (search) {
			products = await this.productService.getAllProductWithSearch(search);
			if (products.length === 0) {
				msg = 'Produk tidak dapat ditemukan';
			}
		} else {
			products = await this.productService.getAllProductOrderByCount();
			if (products.length === 0) {
				msg = 'Daftar produk kosong';
			}
		}
		length = products.length;

		for (let i = 0; i < length; i++) {
			const product: ProductEntity = products[i];
			const units: ProductUnitEntity[] = await this.productUnitService.getProductUnitByProductWithDeleted(product);

			products[i].group = [];
			for (let temp of units) {
				if (temp.delete_at) { continue; }
				const stock: StockEntity | null = await this.stockService.getStockByUnit(temp);
				const price: ProductPriceEntity | null = await this.productPriceService.getProductPriceByUnit(temp);

				if (stock && price) {
					const group: any = {
						id: temp.id,
						unit: temp.unit?.name,
						price: parseInt(price?.price),
						stock: parseInt(stock?.stock)
					}
					products[i].group.push(group);
				}
			}

			if (products[i].group.length === 0) {
				products.splice(i, 1);
				i--;
				length--;
			}
		}

		return RESPONSE(products, msg, HttpStatus.OK);
	}
}
