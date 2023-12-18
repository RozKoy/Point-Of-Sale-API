import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StockService } from './stock.service';
import { StockEntity } from './entity/stock.entity';

const providers = [
{
	provide: 'STOCK_SERVICE',
	useClass: StockService
}
];
const imports = [TypeOrmModule.forFeature([StockEntity])];

@Module({
	imports,
	providers,
	exports: providers
})
export class StockModule {}
