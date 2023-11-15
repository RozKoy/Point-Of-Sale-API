import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitService } from './unit.service';
import { UnitEntity } from './entity/unit.entity';

const providers = [
	{
		provide: 'UNIT_SERVICE',
		useClass: UnitService
	}
];
const imports = [TypeOrmModule.forFeature([UnitEntity])];

@Module({
	imports,
	providers,
})
export class UnitModule {}
