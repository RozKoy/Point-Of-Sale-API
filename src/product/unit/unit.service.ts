import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { NameDto } from './dto';
import { UnitEntity } from './entity/unit.entity';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';

@Injectable()
export class UnitService {
	constructor (
		@InjectRepository(UnitEntity)
		private readonly unitRepository: Repository<UnitEntity>
	) {}

	// CREATE
	async createUnit (author: AdminEntity, nameDto: NameDto): Promise<UnitEntity> {
		const newUnit = await this.unitRepository.create({
			...nameDto,
			author
		});

		return await this.unitRepository.save(newUnit);
	}

	// READ
	async getAllUnit (): Promise<UnitEntity[]> {
		return await this.unitRepository.find();
	}

	async getUnitById (id: string): Promise<UnitEntity | null> {
		return await this.unitRepository.findOneBy({ id });
	}

	async getTrashedUnitById (id: string): Promise<UnitEntity | null> {
		return await this.unitRepository.findOne({ where: { id }, withDeleted: true });
	}

	async getUnitByName (name: string): Promise<UnitEntity | null> {
		return await this.unitRepository.findOneBy({ name });
	}

	async getTrashedUnitByName (name: string): Promise<UnitEntity | null> {
		return await this.unitRepository.findOne({ where: { name }, withDeleted: true });
	}

	// UPDATE
	async updateUnit (id: string, author: AdminEntity): Promise<UnitEntity> {
		const unit: UnitEntity = await this.unitRepository.findOneBy({ id });

		unit.author = author;

		return await this.unitRepository.save(unit);
	}

	// DELETE
	async deleteUnit (id: string): Promise<any> {
		return await this.unitRepository.softDelete(id);
	}

	// RESTORE
	async restoreUnit (id: string): Promise<any> {
		return await this.unitRepository.restore(id);
	}
}
