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

import {
	GetUser,
	RESPONSE,
	RESPONSE_I,
	AdminGuard
} from 'src/utils';

import { SetStockDto } from './dto';

import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { StockEntity } from 'src/inventory/stock/entity/stock.entity';
import { ProductUnitEntity } from 'src/product-group/product-unit/entity/product-unit.entity';
import { Mode, StockRecordEntity } from 'src/inventory/stock-record/entity/stock-record.entity';

import { StockService } from 'src/inventory/stock/stock.service';
import { StockRecordService } from 'src/inventory/stock-record/stock-record.service';
import { ProductUnitService } from 'src/product-group/product-unit/product-unit.service';


@ApiBearerAuth()
@ApiTags('Inventory')

@Controller('inventory')
export class InventoryControllerController {
	constructor (
		@Inject('STOCK_SERVICE') private readonly stockService: StockService,
		@Inject('STOCK_RECORD_SERVICE') private readonly stockRecordService: StockRecordService,
		@Inject('PRODUCT_UNIT_SERVICE') private readonly productUnitService: ProductUnitService
	) {}

	throwError (condition: boolean, msg: string, status: HttpStatus): void {
		if (condition) throw new HttpException(msg, status);
	}

	// Create and Update - Set Stock and Record Stock
	@UseGuards(AdminGuard)
	@Post('/stock/set')
	async setStock (
		@Body() stockDto: SetStockDto, 
		@GetUser() author: AdminEntity
	): Promise<RESPONSE_I>
	{
		const { id, stock, mode } = stockDto;
		const stockNum: number = parseInt(stock);
		this.throwError(!Number.isInteger(stockNum), 'Stok harus berupa bilangan bulat', HttpStatus.BAD_REQUEST);

		const unitGroup: ProductUnitEntity | null = await this.productUnitService.getProductUnitById(id);
		this.throwError(!unitGroup, 'Unit grup tidak dapat ditemukan', HttpStatus.NOT_FOUND);

		const stockEntity: StockEntity | null = await this.stockService.getStockByUnit(unitGroup);
		this.throwError(!stockEntity, 'Stock produk tidak dapat ditemukan', HttpStatus.NOT_FOUND);

		let currentStock: number = parseInt(stockEntity.stock);

		currentStock += mode === Mode.PLUS ? stockNum : -(stockNum);
		this.throwError(currentStock < 0, 'Stok produk tidak boleh dibawah nol', HttpStatus.BAD_REQUEST);

		await this.stockService.update(stockEntity.id, author, currentStock.toString());
		await this.stockRecordService.addStockRecord(author, unitGroup.product, mode, stock);

		return RESPONSE(true, 'Berhasil merubah stok produk', HttpStatus.OK);
	}
}
