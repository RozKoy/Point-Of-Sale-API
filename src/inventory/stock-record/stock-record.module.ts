import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StockRecordService } from './stock-record.service';
import { StockRecordEntity } from './entity/stock-record.entity';

const providers = [
{
	provide: 'STOCK_RECORD_SERVICE',
	useClass: StockRecordService
}
];
const imports = [TypeOrmModule.forFeature([StockRecordEntity])];

@Module({
	imports,
	providers,
	exports: providers
})
export class StockRecordModule {}
