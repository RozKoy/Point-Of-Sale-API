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

	// READ - Get All Invoice with Filter
	@Post('/all')
	async getAllInvoice (
		@Body() intervalDto: IntervalDateDto,
		@Query() paginationDto: PaginationDto
	): Promise<RESPONSE_I>
	{
		const { to, from } = intervalDto;
		const invoices: any = await this.invoiceService.getAllInvoice(intervalDto, paginationDto);
		
		const length: number = invoices.items.length;
		if (length !== 0) {
			for (let i = 0; i < length; i++) {
				const invoice: InvoiceEntity = invoices.items[i];
				
				invoices.items[i].product = 0;
				invoices.items[i].sum = parseInt(invoice.sum);

				const invoiceList: InvoiceListEntity[] = await this.invoiceListService.getInvoiceListByInvoice(invoice);

				for (let temp of invoiceList) {
					const quantity: number = parseInt(temp.quantity);
					invoices.items[i].product += quantity;
				}

				let status: STATUS = STATUS.SUCCESS;
				if (invoice.delete_at) {
					const reqDelete: InvoiceDeleteEntity | null = await this.invoiceDeleteService.getInvoiceDeleteByInvoice(invoice);

					if (reqDelete) {
						status = STATUS.PENDING;
					} else {
						status = STATUS.DELETED;
					}
				}
				invoices.items[i].status = status;
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

		const invoice: any | null = await this.invoiceService.getInvoiceById(id);
		this.throwNotFound(!invoice, 'Invoice tidak dapat ditemukan');

		const invoiceList: Pagination<InvoiceListEntity> = await this.invoiceListService.getInvoiceListByInvoiceWithDeleted(invoice, paginationDto);

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

		const reqDelete: InvoiceDeleteEntity | null = await this.invoiceDeleteService.getInvoiceDeleteByInvoice(invoice);
		this.throwNotFound(!reqDelete, 'Invoice tidak dapat dihapus');

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

		const reqDelete: InvoiceDeleteEntity | null = await this.invoiceDeleteService.getInvoiceDeleteByInvoice(invoice);
		this.throwNotFound(!reqDelete, 'Permintaan hapus invoice tidak dapat ditemukan');

		await this.invoiceDeleteService.update(reqDelete.id, author);
		await this.invoiceDeleteService.delete(reqDelete.id);
		await this.invoiceService.restore(invoice.id);

		return RESPONSE(true, 'Berhasil menolak permintaan hapus invoice', HttpStatus.OK);
	}
}
