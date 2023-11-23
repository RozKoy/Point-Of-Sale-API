import {
	paginate,
	Pagination,
	IPaginationOptions
} from 'nestjs-typeorm-paginate';
import { Like, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UnitEntity } from './entity/unit.entity';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { FilterDto } from 'src/controller/product-controller/dto';

@Injectable()
export class UnitService {
	constructor (
		@InjectRepository(UnitEntity)
		private readonly unitRepository: Repository<UnitEntity>
	) {}

	// CREATE
	async createUnit (author: AdminEntity, name: string): Promise<UnitEntity> {
		const newUnit = await this.unitRepository.create({
			name,
			author
		});

		return await this.unitRepository.save(newUnit);
	}

	// READ
	async getAllUnit (filterDto: FilterDto): Promise<Pagination<UnitEntity>> {
		const { page, limit, search } = filterDto;
		const options: IPaginationOptions = {
			page: page || 1,
			limit: limit || 5
		};

		if (search) {
			return await paginate<UnitEntity>(this.unitRepository, options, {
				where: { name: Like(`%${ search }%`) }
			});
		}

		return await paginate<UnitEntity>(this.unitRepository, options);
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
