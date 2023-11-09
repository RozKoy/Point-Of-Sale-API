import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateCashierDto } from './dto';
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
}
