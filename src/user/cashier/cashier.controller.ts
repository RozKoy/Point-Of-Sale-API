import { 
	Get,
	Post,
	Body,
	Param,
	Inject,
	Controller,
	HttpStatus,
	HttpException
} from '@nestjs/common';

import { CreateCashierDto } from './dto';
import { cashierCode } from 'src/utils/otp';
import { CashierService } from './cashier.service';

@Controller('cashier')
export class CashierController {
	constructor (
		@Inject('CASHIER_SERVICE') private readonly cashierService: CashierService
	) {}

	// CREATE
	@Post('/create')
	async createCashier (@Body() createCashierDto: CreateCashierDto) {
		const { username } = createCashierDto;

		let cashier = await this.cashierService.getCashierByUsername(username);

		if (!cashier) {
			let check: boolean = false;
			let code: string | null = null;
			
			for (let i = 1; i <= 3; i++) {
				code = cashierCode();
				cashier = await this.cashierService.getCashierByCode(code);
				if (!cashier) {
					check = true;
					break;
				}
			}

			if (check && code) {
				const author = '480ac695-8bfe-42b8-9035-56a7d90c75a7';
				return await this.cashierService.createCashier(author, code, createCashierDto);
			}
		}

		throw new HttpException('Tidak dapat membuat akun kasir', HttpStatus.CONFLICT);
	}

	// READ
	@Get()
	async getAllCashier () {
		return await this.cashierService.getAllCashier();
	}

	@Get('/:id')
	async getCashierById (@Param() id: string) {
		const cashier = await this.cashierService.getCashierById(id);

		if (cashier) {
			return cashier;
		}

		throw new HttpException('Kasir tidak ditemukan', HttpStatus.NOT_FOUND);
	}

	
}
