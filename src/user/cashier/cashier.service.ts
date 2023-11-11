import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CashierEntity } from './entity/cashier.entity';
import { CreateCashierDto, UpdateCashierDto } from './dto';

@Injectable()
export class CashierService {
	constructor (
		@InjectRepository(CashierEntity) 
		private readonly cashierRepository: Repository<CashierEntity>
	) {}

	// CREATE
	async createCashier (
		author: string, code: string, createCashierDto: CreateCashierDto
	): Promise<CashierEntity> 
	{
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
		return await this.cashierRepository.findOneBy({ id });
	}

	async getTrashedCashierById (id: string): Promise<CashierEntity | null> {
		return await this.cashierRepository.findOne({ where: { id }, withDeleted: true });
	}

	async getCashierByCode (code: string): Promise<CashierEntity | null> {
		return await this.cashierRepository.findOneBy({ code });
	}

	async getTrashedCashierByCode (code: string): Promise<CashierEntity | null> {
		return await this.cashierRepository.findOne({ where: { code }, withDeleted: true });
	}

	async getCashierByUsername (username: string): Promise<CashierEntity | null> {
		return await this.cashierRepository.findOneBy({ username });
	}

	async getTrashedCashierByUsername (username: string): Promise<CashierEntity | null> {
		return await this.cashierRepository.findOne({ where: { username }, withDeleted: true });
	}

	// UPDATE
	async updateCashier (id: string, updateCashierDto: UpdateCashierDto): Promise<CashierEntity> {
		const { username, image } = updateCashierDto;
		const cashier: CashierEntity = await this.cashierRepository.findOneBy({ id });

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
