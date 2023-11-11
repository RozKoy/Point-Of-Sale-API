import { 
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Inject,
	Controller,
	HttpStatus,
	HttpException
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { 
	CreateCashierDto, 
	UpdateCashierDto 
} from './dto';
import { cashierCode } from 'src/utils';
import { CashierService } from './cashier.service';

@ApiTags('Cashier')
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
	async getCashierById (@Param('id') id: string) {
		const cashier = await this.cashierService.getCashierById(id);

		if (cashier) {
			return cashier;
		}

		throw new HttpException('Kasir tidak ditemukan', HttpStatus.NOT_FOUND);
	}

	// UPDATE
	@Post('/update/:id')
	async updateCashier (@Body() updateCashierDto: UpdateCashierDto, @Param('id') id: string) {
		const { username, image } = updateCashierDto;

		if (username || image) {
			const cashier = await this.cashierService.getCashierById(id);

			if (cashier) {
				return await this.cashierService.updateCashier(id, updateCashierDto);
			}

			throw new HttpException('Kasir tidak ditemukan', HttpStatus.NOT_FOUND);		
		}

		throw new HttpException('Tidak ada data perubahan', HttpStatus.BAD_REQUEST);
	}

	// DELETE
	@Delete('/delete/:id')
	async deleteCashier (@Param('id') id: string) {
		const cashier = await this.cashierService.getCashierById(id);

		if (cashier) {
			return await this.cashierService.deleteCashierById(id);
		}

		throw new HttpException('Tidak dapat mengahapus akun cashier', HttpStatus.NOT_FOUND);		
	}

	// RESTORE
	@Patch('/restore/:id')
	async restoreCashier (@Param('id') id: string) {
		const cashier = await this.cashierService.getTrashedCashierById(id);

		if (cashier) {
			if (cashier.delete_at !== null) {
				return await this.cashierService.restoreCashierById(id);
			}

			throw new HttpException('Tidak dapat mengembalikan akun', HttpStatus.NOT_ACCEPTABLE);
		}

		throw new HttpException('Admin tidak ditemukan', HttpStatus.NOT_FOUND);
	}
}
