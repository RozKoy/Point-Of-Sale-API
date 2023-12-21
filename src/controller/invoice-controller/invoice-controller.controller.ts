import { 
	Put,
	Body,
	Post,
	Query,
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
	AdminGuard
} from 'src/utils';

import { 
	IDDto,
	PaginationDto, 
	IntervalDateDto 
} from './dto';

import { StockService } from 'src/inventory/stock/stock.service';
import { InvoiceService } from 'src/pos/invoice/invoice.service';
import { InvoiceListService } from 'src/pos/invoice-list/invoice-list.service';
import { InvoiceDeleteService } from 'src/pos/invoice-delete/invoice-delete.service';

import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { InvoiceEntity } from 'src/pos/invoice/entity/invoice.entity';
import { InvoiceListEntity } from 'src/pos/invoice-list/entity/invoice-list.entity';
import { InvoiceDeleteEntity } from 'src/pos/invoice-delete/entity/invoice-delete.entity';

enum STATUS {
	SUCCESS = 'success',
	PENDING = 'pending',
	DELETED = 'deleted'
};

@ApiBearerAuth()
@ApiTags('Invoice')
@UseGuards(AdminGuard)

@Controller('invoice')
export class InvoiceControllerController {
	constructor (
		@Inject('STOCK_SERVICE')
		private readonly stockService: StockService,
		@Inject('INVOICE_SERVICE')
		private readonly invoiceService: InvoiceService,
		@Inject('INVOICE_LIST_SERVICE')
		private readonly invoiceListService: InvoiceListService,
		@Inject('INVOICE_DELETE_SERVICE')
		private readonly invoiceDeleteService: InvoiceDeleteService
	) {}

	throwNotFound (condition: boolean, msg: string): void {
		if (condition) throw new HttpException(msg, HttpStatus.NOT_FOUND);
	}

	// READ - Get Report
	@Post('/report')
	async getReport (
		@Body() intervalDto: IntervalDateDto
	): Promise<RESPONSE_I>
	{
		const { to, from } = intervalDto;
		const invoices: InvoiceEntity[] = await this.invoiceService.getAllInvoice(intervalDto);

		let to_date: Date | null = null;
		let from_date: Date | null = null;

		let income: number = 0;
		let discount: number = 0;
		let product_count: number = 0;
		let invoice_success: number = 0;
		let products: Record<any, any> = {};
		for (let temp of invoices) {
			if (!temp.delete_at) {
				if (!to_date) {
					to_date = temp.create_at;
				}
				from_date = temp.create_at;

				invoice_success++;
				income += parseInt(temp.sum);
				discount += parseInt(temp.discount);

				const invoiceList: InvoiceListEntity[] = await this.invoiceListService.getInvoiceListByInvoiceWithDeleted(temp);
				for (let list of invoiceList) {
					const price: number = parseInt(list.sum);
					const quantity: number = parseInt(list.quantity);
					const productName: string = list.unit.product.name;
					
					if (!products?.productName) {
						products.productName = {
							price: 0,
							quantity: 0
						};
					} else {
						products.productName.price += price;
						products.productName.quantity += quantity;
					}
					product_count += quantity;
				}
			}
		}
		const invoice_count: number = invoices.length;
		const invoice_failed: number = invoice_count - invoice_success;
		const average_income: number = income / invoice_count;

		const data: Record<any, any> = {
			income,
			to_date,
			discount,
			products,
			from_date,
			product_count,
			invoice_count,
			invoice_failed,
			average_income,
			invoice_success,
			to_date_req: to,
			from_date_req: from,
		};

		return RESPONSE(data, 'Berhasil mendapatkan laporan', HttpStatus.OK);
	}

	// READ - Get All Invoice with Filter
	@Post('/all')
	async getAllInvoice (
		@Body() intervalDto: IntervalDateDto,
		@Query() paginationDto: PaginationDto
	): Promise<RESPONSE_I>
	{
		const { to, from } = intervalDto;
		const { page, limit } = paginationDto;

		const invoices: InvoiceEntity[] = await this.invoiceService.getAllInvoice(intervalDto);
		let data: Record<any, any> = {
			items: [],
			meta: {
				itemCount: 0,
				totalPages: 1,
				totalItems: 0,
				currentPage: page | 1,
				itemsPerPage: limit | 5,
			},
			to_date_req: to,
			from_date_req: from
		}

		await Promise.all(
			invoices.map(async (item): Promise<any> => {
				let status: STATUS = STATUS.SUCCESS;
				if (item.delete_at) {
					const reqDelete: InvoiceDeleteEntity | null = await this.invoiceDeleteService.getInvoiceDeleteByInvoiceWithDeleted(item);
					if (!reqDelete) {
						return;
					} else if (!reqDelete.delete_at) {
						status = STATUS.PENDING;
					} else {
						status = STATUS.DELETED;
					}
				}

				let product: number = 0;

				const invoiceList: InvoiceListEntity[] = await this.invoiceListService.getInvoiceListByInvoice(item);

				for (let temp of invoiceList) {
					product += parseInt(temp.quantity);
				}

				const length: number = data.items.length;
				data.items[length] = {
					status,
					product,
					id: item.id,
					code: item.code,
					discount: item.discount,
					sum: parseInt(item.sum),
					create_at: item.create_at,
					update_at: item.update_at,
					delete_at: item.delete_at,
				}
			})
		);

		data.items.sort((a, b) => {
			let da = new Date(a.create_at), db = new Date(b.create_at);
			if (db > da) {
				return 1;
			} else if (db < da) {
				return -1;
			}
			return 0;
		});

		const length: number = data.items.length;

		data.meta.itemCount = length;

		if (!data.items[Math.floor(length / data.meta.itemsPerPage)]) {
			data.meta.totalPages = Math.floor(length / data.meta.itemsPerPage) - 1;
		} else {
			data.meta.totalPages = Math.floor(length / data.meta.itemsPerPage);
		}

		const start: number = (data.meta.currentPage - 1) * data.meta.itemsPerPage;
		const end: number = start + data.meta.itemsPerPage;
		
		data.items = data.items.slice(start, end);

		data.meta.totalItems = data.items.length;

		if (data.items.length) {
			data.to_date = data.items[0].create_at;
			data.from_date = data.items[data.items.length - 1].create_at;
		}

		return RESPONSE(data, 'Berhasil mendapatkan daftar invoice', HttpStatus.OK);
	}

	// READ - Get Invoice Detail
	@Post('/detail')
	async getDetailInvoice (
		@Body() idDto: IDDto,
		@Query() paginationDto: PaginationDto
	): Promise<RESPONSE_I> 
	{
		const { id } = idDto;
		let status: STATUS = STATUS.SUCCESS;

		const invoice: any | null = await this.invoiceService.getInvoiceByIdWithDeleted(id);
		this.throwNotFound(!invoice, 'Invoice tidak dapat ditemukan');

		if (invoice.delete_at) {
			const reqDelete: InvoiceDeleteEntity | null = await this.invoiceDeleteService.getInvoiceDeleteByInvoiceWithDeleted(invoice);

			if (!reqDelete?.delete_at) {
				status = STATUS.PENDING;
			} else if (reqDelete?.delete_at) {
				status = STATUS.DELETED;
			} 
		}

		const invoiceList: Pagination<InvoiceListEntity> = await this.invoiceListService.getInvoiceListByInvoiceWithDeletedAndPagination(invoice, paginationDto);

		invoice.status = status;
		invoice.products = [];
		for (let temp of invoiceList.items) {
			const sum: number = parseInt(temp.sum);
			const unit: string = temp.unit.unit.name;
			const name: string = temp.unit.product.name;
			const quantity: number = parseInt(temp.quantity);
			const price: number = Math.floor(sum / quantity);
			
			invoice.products.push({
				sum,
				unit,
				name,
				price,
				quantity
			});
		}

		invoice.meta = invoiceList.meta;

		return RESPONSE(invoice, 'Berhasil mendapatkan informasi invoice lengkap', HttpStatus.OK);
	}

	// UPDATE - Confirmation Delete Request
	@Put('/delete-invoice/confirm')
	async confirmDeleteInvoice (
		@Body() idDto: IDDto,
		@GetUser() author: AdminEntity
	): Promise<RESPONSE_I>
	{
		const { id } = idDto;
		const invoice: InvoiceEntity | null = await this.invoiceService.getInvoiceByIdWithDeleted(id);
		this.throwNotFound(!invoice || !invoice?.delete_at, 'Invoice tidak dapat ditemukan');

		const reqDelete: InvoiceDeleteEntity | null = await this.invoiceDeleteService.getInvoiceDeleteByInvoiceWithDeleted(invoice);
		this.throwNotFound(!reqDelete || reqDelete?.delete_at !== null, 'Invoice tidak dapat dihapus');

		const invoiceList: InvoiceListEntity[] = await this.invoiceListService.getInvoiceListByInvoiceWithDeleted(invoice);

		for (let temp of invoiceList) {
			const stock: number = parseInt(temp.quantity);
			await this.stockService.updateByProductUnit(stock, temp.unit, author);
		}

		await this.invoiceDeleteService.update(reqDelete.id, author);
		await this.invoiceDeleteService.delete(reqDelete.id);

		return RESPONSE(true, 'Berhasil melakukan konfirmasi hapus invoice', HttpStatus.OK);
	}

	// UPDATE - Rejected Delete Request
	@Put('/delete-invoice/reject')
	async rejectedDeleteInvoice (
		@Body() idDto: IDDto,
		@GetUser() author: AdminEntity
	): Promise<RESPONSE_I>
	{
		const { id } = idDto;
		const invoice: InvoiceEntity | null = await this.invoiceService.getInvoiceByIdWithDeleted(id);
		this.throwNotFound(!invoice || !invoice?.delete_at, 'Invoice tidak dapat ditemukan');

		const reqDelete: InvoiceDeleteEntity | null = await this.invoiceDeleteService.getInvoiceDeleteByInvoiceWithDeleted(invoice);
		this.throwNotFound(!reqDelete || reqDelete?.delete_at !== null, 'Permintaan hapus invoice tidak dapat ditemukan');

		await this.invoiceDeleteService.update(reqDelete.id, author);
		await this.invoiceDeleteService.delete(reqDelete.id);
		await this.invoiceService.restore(invoice.id);

		return RESPONSE(true, 'Berhasil menolak permintaan hapus invoice', HttpStatus.OK);
	}
}
