import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SoldRecordService } from './sold-record.service';
import { SoldRecordEntity } from './entity/sold-record.entity';

const providers = [
	{
		provide: 'SOLD_RECORD_SERVICE',
		useClass: SoldRecordService
	}
];
const imports = [TypeOrmModule.forFeature([SoldRecordEntity])];

@Module({
	imports,
	providers
})
export class SoldRecordModule {}
