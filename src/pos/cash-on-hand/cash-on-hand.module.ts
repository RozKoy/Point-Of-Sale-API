import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CashOnHandService } from './cash-on-hand.service';
import { CashOnHandEntity } from './entity/cash-on-hand.entity';

const providers = [
{
	provide: 'CASH_ON_HAND_SERVICE',
	useClass: CashOnHandService
}
];
const imports = [TypeOrmModule.forFeature([CashOnHandEntity])];

@Module({
	imports,
	providers,
	exports: providers
})
export class CashOnHandModule {}
