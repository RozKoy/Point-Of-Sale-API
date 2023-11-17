import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PrizeService } from './prize.service';
import { PrizeEntity } from './entity/prize.entity';

const providers = [
	{
		provide: 'PRIZE_SERVICE',
		useClass: PrizeService
	}
];
const imports = [TypeOrmModule.forFeature([PrizeEntity])];

@Module({
	imports,
  providers
})
export class PrizeModule {}
