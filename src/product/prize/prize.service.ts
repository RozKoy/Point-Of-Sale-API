import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PrizeEntity } from './entity/prize.entity';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';

@Injectable()
export class PrizeService {
	constructor (
		@InjectRepository(PrizeEntity)
		private readonly prizeRepository: Repository<PrizeEntity>
	) {}

	// CREATE
	async createPrize (
		author: AdminEntity, prize: string
	): Promise<PrizeEntity> 
	{
		const newPrize: PrizeEntity = await this.prizeRepository.create({
			prize,
			author
		});

		return await this.prizeRepository.save(newPrize);
	}

	// READ 
	async getPrizeById (
		id: string
	): Promise<PrizeEntity | null> 
	{
		return await this.prizeRepository.findOneBy({ id });
	}

	async getPrizeByPrize (
		prize: string
	): Promise<PrizeEntity | null> 
	{
		return await this.prizeRepository.findOneBy({ prize });
	}
}
