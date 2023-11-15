import { Module } from '@nestjs/common';

import { UnitService } from './unit.service';

const providers = [
	{
		provide: 'UNIT_SERVICE',
		useClass: UnitService
	}
];

@Module({
  providers,
})
export class UnitModule {}
