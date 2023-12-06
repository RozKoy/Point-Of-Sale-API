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

import { ProductService } from 'src/product/product/product.service';
import { InvoiceDeleteService } from 'src/pos/invoice-delete/invoice-delete.service';
import { ProductExpiredDateService } from 'src/product/product-expired-date/product-expired-date.service';

import { ProductEntity } from 'src/product/product/entity/product.entity';
import { InvoiceDeleteEntity } from 'src/pos/invoice-delete/entity/invoice-delete.entity';
import { ProductExpiredDateEntity } from 'src/product/product-expired-date/entity/product-expired-date.entity';

@ApiBearerAuth()
@UseGuards(AdminGuard)
@ApiTags('Notification')

@Controller('notification')
export class NotificationControllerController {
	constructor (
		@Inject('PRODUCT_SERVICE')
		private readonly productService: ProductService,
		@Inject('INVOICE_DELETE_SERVICE')
		private readonly invoiceDeleteService: InvoiceDeleteService,
		@Inject('PRODUCT_EXPIRED_DATE_SERVICE')
		private readonly productExpiredAtService: ProductExpiredDateService
	) {}

	// READ - Get Count of Notification
	@Get('/count')
	async getCountNotification (): Promise<RESPONSE_I> {
		const products: ProductEntity[] = await this.productService.getAllProduct();
		const invoiceDelete: InvoiceDeleteEntity[] = await this.invoiceDeleteService.getAllInvoiceDelete();
		const expiredProduct: ProductExpiredDateEntity[] = [];
		for (let product of products) {
			const expiredProductExists: ProductExpiredDateEntity[] = await this.productExpiredAtService.getExpiredAtByProductAndTime(product);
			const length: number = expiredProductExists.length;
			if (length !== 0) {
				expiredProduct.push(expiredProductExists[length - 1]);
			}
		}

		const notification: number = invoiceDelete.length + expiredProduct.length;

		return RESPONSE({ notification }, 'Berhasil mendapatkan jumlah notifikasi', HttpStatus.OK);
	}

	// READ - Get All Invoice Delete Request
	@Get('/invoice-delete-request')
	async getInvoiceDeleteRequest (): Promise<RESPONSE_I> {
		const invoiceDelete: InvoiceDeleteEntity[] = await this.invoiceDeleteService.getAllInvoiceDelete();

		return RESPONSE(invoiceDelete, 'Berhasil mendapatkan permintaan hapus invoice', HttpStatus.OK);
	}

	// READ - Get Product Expired List
	@Get('/product-expired-date')
	async getProductExpired (): Promise<RESPONSE_I> {
		const products: ProductEntity[] = await this.productService.getAllProduct();
		const expiredProduct: ProductExpiredDateEntity[] = [];
		for (let product of products) {
			const expiredProductExists: ProductExpiredDateEntity[] = await this.productExpiredAtService.getExpiredAtByProductAndTime(product);
			const length: number = expiredProductExists.length;
			if (length !== 0) {
				expiredProduct.push(expiredProductExists[length - 1]);
			}
		}

		return RESPONSE(expiredProduct, 'Berhasil mendapatkan daftar produk kadaluarsa', HttpStatus.OK);
	}
}
