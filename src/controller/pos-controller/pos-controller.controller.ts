import { 
	Get,
	Post,
	Body,
	Query,
	Patch,
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
	GetUser,
	RESPONSE,
	RESPONSE_I,
	CashierGuard 
} from 'src/utils';

import { 
	IDDto,
	SearchDto, 
	PaginationDto,
	CreateInvoiceDto,
	DeleteRequestDto
} from './dto';

import { DraftService } from 'src/pos/draft/draft.service';
import { StockService } from 'src/inventory/stock/stock.service';
import { InvoiceService } from 'src/pos/invoice/invoice.service';
import { ProductService } from 'src/product/product/product.service';
import { InvoiceListService } from 'src/pos/invoice-list/invoice-list.service';
import { InvoiceDeleteService } from 'src/pos/invoice-delete/invoice-delete.service';
import { ProductUnitService } from 'src/product-group/product-unit/product-unit.service';
import { ProductPriceService } from 'src/product-group/product-price/product-price.service';

import { StockEntity } from 'src/inventory/stock/entity/stock.entity';
import { InvoiceEntity } from 'src/pos/invoice/entity/invoice.entity';
import { CashierEntity } from 'src/user/cashier/entity/cashier.entity';
import { InvoiceDraftEntity } from 'src/pos/draft/entity/draft.entity';
import { ProductEntity } from 'src/product/product/entity/product.entity';
import { InvoiceListEntity } from 'src/pos/invoice-list/entity/invoice-list.entity';
import { ProductUnitEntity } from 'src/product-group/product-unit/entity/product-unit.entity';
import { ProductPriceEntity } from 'src/product-group/product-price/entity/product-price.entity';

@ApiTags('POS')
@ApiBearerAuth()
@UseGuards(CashierGuard)

@Controller('pos')
export class PosControllerController {
	constructor (
		@Inject('DRAFT_SERVICE')
		private readonly draftService: DraftService,
		@Inject('STOCK_SERVICE') 
		private readonly stockService: StockService,
		@Inject('INVOICE_SERVICE')
		private readonly invoiceService: InvoiceService,
		@Inject('PRODUCT_SERVICE')
		private readonly productService: ProductService,
		@Inject('PRODUCT_UNIT_SERVICE')
		private readonly productUnitService: ProductUnitService,
		@Inject('INVOICE_LIST_SERVICE')
		private readonly invoiceListService: InvoiceListService,
		@Inject('PRODUCT_PRICE_SERVICE') 
		private readonly productPriceService: ProductPriceService,
		@Inject('INVOICE_DELETE_SERVICE')
		private readonly invoiceDeleteService: InvoiceDeleteService
	) {}

	throwNotFound (condition: boolean, msg: string): void {
		if (condition) throw new HttpException(msg, HttpStatus.NOT_FOUND);
	}

	throwBadRequest (condition: boolean, msg: string): void {
		if (condition) throw new HttpException(msg, HttpStatus.BAD_REQUEST);
	}

	throwUnauthorized (condition: boolean): void {
		if (condition) throw new HttpException([], HttpStatus.UNAUTHORIZED);
	}

	// CREATE - Create Invoice
	@Post('/invoice/create')
	async createInvoice (
		@GetUser() cashier: CashierEntity,
		@Body() createInvoiceDto: CreateInvoiceDto
	): Promise<RESPONSE_I>
	{
		const { items, discount } = createInvoiceDto;

		// CHECK ITEMS
		let sum: number = 0;
		for (let item of items) {
			const count: any[] = items.filter((value) => value.unit === item.unit);
			this.throwBadRequest(count.length > 1, 'Unit tidak dapat terduplikasi');

			const productUnit: ProductUnitEntity | null = await this.productUnitService.getProductUnitByIdWithDeleted(item.unit);
			this.throwNotFound(!productUnit, 'Unit tidak dapat ditemukan');

			const productPrice: ProductPriceEntity | null = await this.productPriceService.getProductPriceByUnitWithDeleted(productUnit);
			this.throwNotFound(!productPrice, 'Harga sebuah unit tidak dapat ditemukan');

			const productStock: StockEntity | null = await this.stockService.getStockByUnit(productUnit);
			this.throwNotFound(!productStock, 'Stok produk tidak dapat ditemukan');

			const sumPrice: number = parseInt(item.quantity) * parseInt(productPrice.price);

			sum += sumPrice;
		}

		const invoice: InvoiceEntity = await this.invoiceService.createInvoice(sum.toString(), discount, cashier);

		for (let item of items) {
			const productUnit: ProductUnitEntity | null = await this.productUnitService.getProductUnitByIdWithDeleted(item.unit);
			const productPrice: ProductPriceEntity | null = await this.productPriceService.getProductPriceByUnitWithDeleted(productUnit);
			const productStock: StockEntity | null = await this.stockService.getStockByUnit(productUnit);

			const sumPrice: number = parseInt(item.quantity) * parseInt(productPrice.price);

			await this.invoiceListService.createInvoiceList(
				sumPrice.toString(),
				item.quantity,
				invoice,
				productUnit
			);

			const currentStock: number = parseInt(productStock.stock);
			const pickStock: number = parseInt(item.quantity);
			const newStock: number = currentStock - pickStock;

			if (newStock < 0) {
				await this.stockService.updateByProductUnit(currentStock * -1, productUnit);
			} else {
				await this.stockService.updateByProductUnit(pickStock * -1, productUnit);
			}

			await this.productService.plusCountProduct(productUnit.product.id, pickStock);
		}

		return RESPONSE(true, 'Berhasil membuat invoice', HttpStatus.CREATED);
	}

	// CREATE - Create Draft
	@Post('/draft/create')
	async createDraft (
		@GetUser() cashier: CashierEntity,
		@Body() createInvoiceDto: CreateInvoiceDto
	): Promise<RESPONSE_I>
	{
		const { items, discount } = createInvoiceDto;

		// CHECK ITEMS
		let sum: number = 0;
		for (let item of items) {
			const count: any[] = items.filter((value) => value.unit === item.unit);
			this.throwBadRequest(count.length > 1, 'Unit tidak dapat terduplikasi');

			const productUnit: ProductUnitEntity | null = await this.productUnitService.getProductUnitByIdWithDeleted(item.unit);
			this.throwNotFound(!productUnit, 'Unit tidak dapat ditemukan');

			const productPrice: ProductPriceEntity | null = await this.productPriceService.getProductPriceByUnitWithDeleted(productUnit);
			this.throwNotFound(!productPrice, 'Harga sebuah unit tidak dapat ditemukan');

			const sumPrice: number = parseInt(item.quantity) * parseInt(productPrice.price);

			sum += sumPrice;
		}

		const invoice: InvoiceEntity = await this.invoiceService.createInvoice(sum.toString(), discount, cashier);

		for (let item of items) {
			const productUnit: ProductUnitEntity | null = await this.productUnitService.getProductUnitByIdWithDeleted(item.unit);
			const productPrice: ProductPriceEntity | null = await this.productPriceService.getProductPriceByUnitWithDeleted(productUnit);

			const sumPrice: number = parseInt(item.quantity) * parseInt(productPrice.price);

			await this.invoiceListService.createInvoiceList(
				sumPrice.toString(),
				item.quantity,
				invoice,
				productUnit
			);
		}

		await this.draftService.createDraft(invoice, cashier);
		await this.invoiceService.delete(invoice.id);

		return RESPONSE(true, 'Berhasil membuat draft', HttpStatus.CREATED);
	}

	// READ - Get All Product with Search
	@Get('/product/all')
	async getAllProductWithSearch (
		@Query() searchDto: SearchDto
	): Promise<RESPONSE_I>
	{
		let length: number = 0;
		let products: any[] = [];
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

	// READ - Get Daily History
	@Get('/invoice/history')
	async getInvoiceHistory (
		@GetUser() cashier: CashierEntity,
		@Query() paginationDto: PaginationDto
	): Promise<RESPONSE_I>
	{
		const invoices: Pagination<InvoiceEntity> = await this.invoiceService.getDailyInvoiceByCashierWithPagination(cashier, paginationDto);
		const data: Record<any, any> = {
			items: [],
			meta: invoices.meta
		};

		data.items = await Promise.all(
			invoices.items.map(async (value, index): Promise<Record<any, any>> => {
				const id: string = value.id;
				const groupInvoice: any[] = [];
				const time: Date = value.create_at;
				const invoice: string = value.code;

				const invoiceList: InvoiceListEntity[] = await this.invoiceListService.getInvoiceListByInvoiceWithDeleted(value);
				for (let list of invoiceList) {
					const tempData: Record<any, any> = {
						id: list.id,
						name: list.unit.product.name,
						quantity: parseInt(list.quantity),
						group: [{
							id: list.unit.id,
							unit: list.unit.unit.name,
							price: Math.floor(parseInt(list.sum) / parseInt(list.quantity))
						}]
					};
					groupInvoice.push(tempData);
				}
				return {
					id,
					time,
					invoice,
					groupInvoice
				}
			})
		);

		return RESPONSE(data, 'Berhasil mendapatkan daftar riwayat penjualan', HttpStatus.OK);
	}

	// READ - Get Draft Count
	@Get('/draft/count')
	async getDraftCount (
		@GetUser() cashier: CashierEntity
	): Promise<RESPONSE_I> 
	{
		const draft: InvoiceDraftEntity[] = await this.draftService.getAllDraftByCashierWithDeleted(cashier);
		const data: InvoiceDraftEntity[] = draft.filter((d) => d.delete_at === null);
		const count: number = data.length;

		return RESPONSE(count, 'Berhasil menghitung jumlah draft', HttpStatus.OK);
	}

	// READ - Get All Draft with Pagination
	@Get('/draft/all')
	async getAllDraftWithPagination (
		@GetUser() cashier: CashierEntity,
		@Query() paginationDto: PaginationDto
	): Promise<RESPONSE_I>
	{
		const draft: Pagination<InvoiceDraftEntity> = await this.draftService.getAllDraftPaginationWithDeleted(cashier, paginationDto);
		const data: Record<any, any> = {
			items: [],
			meta: draft.meta
		};

		for (let temp of draft.items) {
			if (temp.delete_at === null) {
				const id: string = temp.id;
				const groupDraft: any[] = [];
				const time: Date = temp.create_at;
				const invoice: string = temp.invoice.code;

				const invoiceList: InvoiceListEntity[] = await this.invoiceListService.getInvoiceListByInvoiceWithDeleted(temp.invoice);
				for (let list of invoiceList) {
					const tempData: Record<any, any> = {
						id: list.id,
						name: list.unit.product.name,
						quantity: parseInt(list.quantity),
						group: [{
							id: list.unit.id,
							unit: list.unit.unit.name,
							price: Math.floor(parseInt(list.sum) / parseInt(list.quantity))
						}]
					};
					groupDraft.push(tempData);
				}
				data.items.push({
					id,
					time,
					invoice,
					groupDraft
				});
			}
		}

		return RESPONSE(data, 'Berhasil mendapatkan daftar draft', HttpStatus.OK);
	}

	// UPDATE - Set Invoice Delete Request
	@Patch('/invoice/set-delete-request')
	async setInvoiceDeleteRequest (
		@Body() deleteRequestDto: DeleteRequestDto,
		@GetUser() cashier: CashierEntity
	): Promise<RESPONSE_I>
	{
		const { id, code, message } = deleteRequestDto;
		this.throwUnauthorized(code !== cashier.code);

		const invoice: InvoiceEntity | null = await this.invoiceService.getInvoiceById(id);
		this.throwNotFound(!invoice, 'Invoice tidak dapat ditemukan');
		this.throwUnauthorized(invoice.cashier.id !== cashier.id);

		await this.invoiceDeleteService.createInvoiceDeleteRequest(message, invoice, cashier);
		await this.invoiceService.delete(id);

		return RESPONSE(true, 'Berhasil membuat permintaan hapus invoice', HttpStatus.OK);
	}

	// DELETE - Delete Draft
	@Delete('/draft/delete')
	async deleteDraft (
		@Body() idDto: IDDto,
		@GetUser() cashier: CashierEntity
	): Promise<RESPONSE_I>
	{
		const { id } = idDto;
		const invoiceDraft: InvoiceDraftEntity | null = await this.draftService.getDraftById(id, cashier);
		this.throwNotFound(!invoiceDraft, 'Tidak dapat menemukan draft');

		await this.draftService.delete(id);

		return RESPONSE(true, 'Berhasil menghapus draft', HttpStatus.OK);
	}
}
