import { Module } from '@nestjs/common';

import { PrizeService } from './prize.service';

const providers = [
	{
		provide: 'PRIZE_SERVICE',
		useClass: PrizeService
	}
];

@Module({
  providers,
})
export class PrizeModule {}
