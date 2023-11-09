import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { 
	CreateCashierDto, 
	UpdateCashierDto 
} from './dto';
import { CashierEntity } from './entity/cashier.entity';

@Injectable()
export class CashierService {
	constructor (
		@InjectRepository(CashierEntity) private readonly cashierRepository: Repository<CashierEntity>
	) {}

	// CREATE
	async createCashier (author: string, code: string, createCashierDto: CreateCashierDto): Promise<CashierEntity> {
		const makeCashier: CashierEntity = await this.cashierRepository.create({
			...createCashierDto, code, author
		});

		return await this.cashierRepository.save(makeCashier);
	}

	// READ
	async getAllCashier (): Promise<CashierEntity[]> {
		return await this.cashierRepository.find();
	}

	async getCashierById (id: string): Promise<CashierEntity | null> {
		const cashier: CashierEntity = await this.cashierRepository.findOneBy({ id });

		if (cashier) {
			return cashier;
		}

		return null;
	}

	async getCashierByCode (code: string): Promise<CashierEntity | null> {
		const cashier: CashierEntity = await this.cashierRepository.findOneBy({ code });

		if (cashier) {
			return cashier;
		}

		return null;
	}

	async getCashierByUsername (username: string): Promise<CashierEntity | null> {
		const cashier: CashierEntity = await this.cashierRepository.findOneBy({ username });

		if (cashier) {
			return cashier;
		}

		return null;
	}

	async getTrashedCashierById (id: string): Promise<CashierEntity | null> {
		const cashier: CashierEntity = await this.cashierRepository.findOne({ where: { id }, withDeleted: true });

		if (cashier) {
			return cashier;
		}

		return null;
	}

	// UPDATE
	async updateCashier (id: string, updateCashierDto: UpdateCashierDto): Promise<CashierEntity> {
		const cashier: CashierEntity = await this.cashierRepository.findOneBy({ id });

		const { username, image } = updateCashierDto;

		cashier.image = image ? image : cashier.image;
		cashier.username = username ? username : cashier.username;

		return await this.cashierRepository.save(cashier);
	}

	// DELETE
	async deleteCashierById (id: string): Promise<any> {
		return await this.cashierRepository.softDelete(id);
	}

	// RESTORE
	async restoreCashierById (id: string): Promise<any> {
		return await this.cashierRepository.restore(id);
	}
}
