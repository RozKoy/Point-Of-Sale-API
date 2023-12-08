import {
	Get,
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
	CashierGuard,
} from 'src/utils';

import { SetCashOnHandDto } from './dto';

import { InvoiceEntity } from 'src/pos/invoice/entity/invoice.entity';
import { CashierEntity } from 'src/user/cashier/entity/cashier.entity';
import { CashOnHandEntity } from 'src/pos/cash-on-hand/entity/cash-on-hand.entity';

import { InvoiceService } from 'src/pos/invoice/invoice.service';
import { CashOnHandService } from 'src/pos/cash-on-hand/cash-on-hand.service';

@ApiBearerAuth()
@UseGuards(CashierGuard)
@ApiTags('Cashier - POS')

@Controller('pos/cashier')
export class CashierControllerController {
	constructor (
		@Inject('INVOICE_SERVICE')
		private readonly invoiceService: InvoiceService,
		@Inject('CASH_ON_HAND_SERVICE')
		private readonly cashOnHandService: CashOnHandService
	) {}

	throwBadRequest (condition: boolean, msg: string): void {
		if (condition) throw new HttpException(msg, HttpStatus.BAD_REQUEST);
	}

	throwCondlict (condition: boolean, msg: string): void {
		if (condition) throw new HttpException(msg, HttpStatus.CONFLICT);
	}

	throwNotFound (condition: boolean, msg: string): void {
		if (condition) throw new HttpException(msg, HttpStatus.NOT_FOUND);
	}

	// CREATE - Set Cashier Cash On Hand
	@Post('/cash-on-hand/set')
	async setCashOnHand (
		@Body() setCashOnHandDto: SetCashOnHandDto,
		@GetUser() cashier: CashierEntity
	): Promise<RESPONSE_I>
	{
		const { cash_on_hand } = setCashOnHandDto;
		const num: number = +cash_on_hand;
		this.throwBadRequest(num < 0 || !Number.isInteger(num), 'Uang ditangan harus diatas 0 dan bilangan bulat');

		const cashOnHandExists: CashOnHandEntity | null = await this.cashOnHandService.getCashOnHandByCashier(cashier);
		this.throwCondlict(cashOnHandExists !== null, 'Tidak dapat membuat uang ditangan');

		const newCashOnHand: CashOnHandEntity = await this.cashOnHandService.addCashOnHand(cashier, cash_on_hand);

		return RESPONSE(newCashOnHand, 'Berhasil menambahkan uang ditangan', HttpStatus.CREATED);
	}

	// READ - Get Cash On Hand
	@Get('/cash-on-hand/get')
	async getCashOnHand (@GetUser() cashier: CashierEntity): Promise<RESPONSE_I> {
		const cashOnHand: CashOnHandEntity | null = await this.cashOnHandService.getCashOnHandByCashier(cashier);

		this.throwNotFound(!cashOnHand, 'Uang ditangan tidak dapat ditemukan');

		return RESPONSE(cashOnHand?.cash_on_hand, 'Berhasil mendapatkan uang ditangan', HttpStatus.OK);
	}

	// READ - Get Daily Income
	@Get('/income/get')
	async getDailyIncome (@GetUser() cashier: CashierEntity): Promise<RESPONSE_I> {
		const invoiceArray: InvoiceEntity[] = await this.invoiceService.getDailyInvoiceByCashier(cashier);

		let sumIncome: number = 0;
		for (let temp of invoiceArray) {
			sumIncome += parseInt(temp.sum);
		}

		return RESPONSE(sumIncome, 'Berhasil mendapatkan jumlah pendapatan', HttpStatus.OK);
	}
}
