import { 
	Get,
	Put,
	Post,
	Body,
	Patch,
	Param,
	Query,
	Delete,
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
	AdminGuard,
	cashierCode,
	CashierGuard
} from 'src/utils';
import { 
	IDDto,
	FilterDto,
	CreateCashierDto, 
	UpdateCashierDto 
} from './dto';
import { CashierService } from './cashier.service';
import { CashierEntity } from './entity/cashier.entity';

@ApiBearerAuth()
@ApiTags('Cashier')

@Controller('cashier')
export class CashierController {
	constructor (
		@Inject('CASHIER_SERVICE') private readonly cashierService: CashierService
	) {}

	// CREATE - Add Cashier
	@UseGuards(AdminGuard)
	@Post('/add')
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
				cashier = await this.cashierService.createCashier(code, createCashierDto);

				return RESPONSE(cashier, 'Berhasil membuat akun kasir', HttpStatus.CREATED);
			}
		}

		throw new HttpException('Tidak dapat membuat akun kasir', HttpStatus.CONFLICT);
	}

	// READ - Get Cashier Profile
	@UseGuards(CashierGuard) 
	@Get('/profile')
	getProfile (@GetUser() user: CashierEntity): RESPONSE_I {
		return RESPONSE(user, 'Berhasil mendapatkan profil kasir', HttpStatus.OK);
	}

	// READ - Get Cashier with Search
	@UseGuards(AdminGuard)
	@Get('/all')
	async getAllCashier (@Query() filterDto: FilterDto): Promise<RESPONSE_I> {
		const { search } = filterDto;
		const cashiers: Pagination<CashierEntity> = await this.cashierService.getAllCashier(filterDto);

		if (cashiers.items.length !== 0) {
			return RESPONSE(cashiers, 'Berhasil mendapatkan daftar akun kasir', HttpStatus.OK);
		}

		let msg: string = 'Daftar akun kasir kosong';

		if (search) {
			msg = 'Akun kasir tidak ditemukan';
		}

		return RESPONSE(cashiers, msg, HttpStatus.NO_CONTENT);
	}

	// UPDATE - Edit Cashier
	@UseGuards(AdminGuard)
	@Put('/update')
	async updateCashier (@Body() updateCashierDto: UpdateCashierDto): Promise<RESPONSE_I> {
		const { id, username, image } = updateCashierDto;

		if (username || image) {
			const cashier: CashierEntity | null = await this.cashierService.getCashierById(id);

			if (cashier) {
				const updatedCashier: CashierEntity = await this.cashierService.updateCashier(updateCashierDto);

				return RESPONSE(updatedCashier, 'Berhasil mengubah data akun kasir', HttpStatus.OK);
			}

			throw new HttpException('Kasir tidak ditemukan', HttpStatus.NOT_FOUND);		
		}

		throw new HttpException('Tidak ada data perubahan', HttpStatus.BAD_REQUEST);
	}

	// DELETE - Delete Cashier
	@UseGuards(AdminGuard)
	@Delete('/delete')
	async deleteCashier (@Body() idDto: IDDto): Promise<RESPONSE_I> {
		const { id } = idDto;
		const cashier: CashierEntity | null = await this.cashierService.getCashierById(id);

		if (cashier) {
			const response: any = await this.cashierService.deleteCashierById(id);
			return RESPONSE(response, 'Berhasil menghapus akun kasir', HttpStatus.OK);
		}

		throw new HttpException('Tidak dapat mengahapus akun cashier', HttpStatus.NOT_FOUND);		
	}

/*
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
*/
}
