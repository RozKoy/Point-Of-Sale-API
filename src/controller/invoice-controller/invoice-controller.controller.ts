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
		const invoices: any = await this.invoiceService.getAllInvoiceWithDeleted(intervalDto, paginationDto);
		
		let length: number = invoices.items.length;
		if (length !== 0) {
			invoices.to_date_req = to;
			invoices.from_date_req = from;
			invoices.to_date = invoices.items[0].create_at;
			invoices.from_date = invoices.items[length - 1].create_at;
			for (let i = 0; i < length; i++) {
				let status: STATUS = STATUS.SUCCESS;
				const invoice: InvoiceEntity = invoices.items[i];

				if (invoice.delete_at) {
					const reqDelete: InvoiceDeleteEntity | null = await this.invoiceDeleteService.getInvoiceDeleteByInvoiceWithDeleted(invoice);

					if (!reqDelete?.delete_at) {
						status = STATUS.PENDING;
					} else if (reqDelete?.delete_at) {
						status = STATUS.DELETED;
					} else {
						invoices.items.splice(i, 1);
						i--;
						length--;
						continue;
					}
				}
				invoices.items[i].status = status;
				
				invoices.items[i].product = 0;
				invoices.items[i].sum = parseInt(invoice.sum);

				const invoiceList: InvoiceListEntity[] = await this.invoiceListService.getInvoiceListByInvoice(invoice);

				for (let temp of invoiceList) {
					const quantity: number = parseInt(temp.quantity);
					invoices.items[i].product += quantity;
				}
			}
		}

		return RESPONSE(invoices, 'Berhasil mendapatkan daftar invoice', HttpStatus.OK);
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
