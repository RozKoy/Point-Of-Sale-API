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
	CashierGuard,
} from 'src/utils';

import { SetCashOnHandDto } from './dto';

import { CashierEntity } from 'src/user/cashier/entity/cashier.entity';
import { CashOnHandEntity } from 'src/pos/cash-on-hand/entity/cash-on-hand.entity';

import { CashOnHandService } from 'src/pos/cash-on-hand/cash-on-hand.service';

@ApiBearerAuth()
@UseGuards(CashierGuard)
@ApiTags('Cashier - POS')

@Controller('pos/cashier')
export class CashierControllerController {
	constructor (
		@Inject('CASH_ON_HAND_SERVICE')
		private readonly cashOnHandService: CashOnHandService
	) {}

	throwBadRequest (condition: boolean, msg: string): void {
		if (condition) throw new HttpException(msg, HttpStatus.BAD_REQUEST);
	}

	throwCondlict (condition: boolean, msg: string): void {
		if (condition) throw new HttpException(msg, HttpStatus.CONFLICT);
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
}
