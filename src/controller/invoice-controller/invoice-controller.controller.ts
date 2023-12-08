import { 
	Body,
	Post,
	Query,
	Inject,
	UseGuards,
	Controller,
	HttpStatus 
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { 
	RESPONSE,
	RESPONSE_I,
	AdminGuard
} from 'src/utils';

import { PaginationDto, IntervalDateDto } from './dto';

import { InvoiceService } from 'src/pos/invoice/invoice.service';
import { InvoiceListService } from 'src/pos/invoice-list/invoice-list.service';
import { InvoiceDeleteService } from 'src/pos/invoice-delete/invoice-delete.service';

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
}
