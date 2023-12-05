import { 
	Get,
	Inject,
	UseGuards,
	Controller,
	HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { 
	RESPONSE,
	RESPONSE_I,
	AdminGuard 
} from 'src/utils';

import { InvoiceDeleteService } from 'src/pos/invoice-delete/invoice-delete.service';
import { ProductExpiredDateService } from 'src/product/product-expired-date/product-expired-date.service';

import { InvoiceDeleteEntity } from 'src/pos/invoice-delete/entity/invoice-delete.entity';
import { ProductExpiredDateEntity } from 'src/product/product-expired-date/entity/product-expired-date.entity';

@ApiBearerAuth()
// @UseGuards(AdminGuard)
@ApiTags('Notification')

@Controller('notification')
export class NotificationControllerController {
	constructor (
		@Inject('INVOICE_DELETE_SERVICE')
		private readonly invoiceDeleteService: InvoiceDeleteService,
		@Inject('PRODUCT_EXPIRED_DATE_SERVICE')
		private readonly productExpiredAtService: ProductExpiredDateService
	) {}

	// READ - Get Count of Notification
	@Get('/count')
	async getCountNotification (): Promise<RESPONSE_I> {
		const invoiceDelete: InvoiceDeleteEntity[] = await this.invoiceDeleteService.getAllInvoiceDelete();
		const expiredProduct: ProductExpiredDateEntity[] = await this.productExpiredAtService.getExpiredAtByTime();

		const notification: number = invoiceDelete.length + expiredProduct.length;

		return RESPONSE({ notification }, 'Berhasil mendapatkan jumlah notifikasi', HttpStatus.OK);
	}
}
