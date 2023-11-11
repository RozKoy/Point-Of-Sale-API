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
	RESPONSE,
	RESPONSE_I,
	cashierCode 
} from 'src/utils';
import { CashierService } from './cashier.service';
import { CashierEntity } from './entity/cashier.entity';
import { CreateCashierDto, UpdateCashierDto } from './dto';

@ApiTags('Cashier')
@Controller('cashier')
export class CashierController {
	constructor (
		@Inject('CASHIER_SERVICE') private readonly cashierService: CashierService
	) {}

	// CREATE
	@Post('/create')
	async createCashier (@Body() createCashierDto: CreateCashierDto): Promise<RESPONSE_I> {
		const { username } = createCashierDto;

		let cashier: CashierEntity | null = await this.cashierService.getTrashedCashierByUsername(username);

		if (!cashier) {
			let check: boolean = false;
			let code: string | null = null;
			
			for (let i = 1; i <= 3; i++) {
				code = cashierCode();
				cashier = await this.cashierService.getTrashedCashierByCode(code);
				if (!cashier) {
					check = true;
					break;
				}
			}

			if (check && code) {
				const author = '480ac695-8bfe-42b8-9035-56a7d90c75a7';
				cashier = await this.cashierService.createCashier(author, code, createCashierDto);
				return RESPONSE(cashier, 'Berhasil membuat akun kasir', HttpStatus.OK);
			}
		}

		throw new HttpException('Tidak dapat membuat akun kasir', HttpStatus.CONFLICT);
	}

	// READ
	@Get()
	async getAllCashier (): Promise<RESPONSE_I> {
		const cashier: CashierEntity[] = await this.cashierService.getAllCashier();
		
		if (cashier.length !== 0) {
			return RESPONSE(cashier, '', HttpStatus.OK);
		}

		return RESPONSE(cashier, 'Tidak ada data akun kasir', HttpStatus.NO_CONTENT);
	}

	@Get('/:id')
	async getCashierById (@Param('id') id: string): Promise<RESPONSE_I> {
		const cashier: CashierEntity | null = await this.cashierService.getCashierById(id);

		if (cashier) {
			return RESPONSE(cashier, 'Berhasil mendapatkan data akun kasir', HttpStatus.OK);	
		}

		throw new HttpException('Kasir tidak ditemukan', HttpStatus.NOT_FOUND);
	}

	// UPDATE
	@Post('/update/:id')
	async updateCashier (
		@Body() updateCashierDto: UpdateCashierDto, @Param('id') id: string
	): Promise<RESPONSE_I> 
	{
		const { username, image } = updateCashierDto;

		if (username || image) {
			const cashier: CashierEntity | null = await this.cashierService.getCashierById(id);

			if (cashier) {
				const updatedCashier: CashierEntity = await this.cashierService.updateCashier(id, updateCashierDto);
				return RESPONSE(updatedCashier, 'Berhasil mengubah data akun kasir', HttpStatus.OK);
			}

			throw new HttpException('Kasir tidak ditemukan', HttpStatus.NOT_FOUND);		
		}

		throw new HttpException('Tidak ada data perubahan', HttpStatus.BAD_REQUEST);
	}

	// DELETE
	@Delete('/delete/:id')
	async deleteCashier (@Param('id') id: string): Promise<RESPONSE_I> {
		const cashier: CashierEntity | null = await this.cashierService.getCashierById(id);

		if (cashier) {
			const response: any = await this.cashierService.deleteCashierById(id);
			return RESPONSE(response, 'Berhasil menghapus akun kasir', HttpStatus.OK);
		}

		throw new HttpException('Tidak dapat mengahapus akun cashier', HttpStatus.NOT_FOUND);		
	}

	// RESTORE
	@Patch('/restore/:id')
	async restoreCashier (@Param('id') id: string): Promise<RESPONSE_I> {
		const cashier: CashierEntity | null = await this.cashierService.getTrashedCashierById(id);

		if (cashier) {
			if (cashier.delete_at !== null) {
				const response: any = await this.cashierService.restoreCashierById(id);
				return RESPONSE(response, 'Berhasil mengembalikan akun kasir', HttpStatus.OK);
			}

			throw new HttpException('Tidak dapat mengembalikan akun', HttpStatus.NOT_ACCEPTABLE);
		}

		throw new HttpException('Admin tidak ditemukan', HttpStatus.NOT_FOUND);
	}
}
