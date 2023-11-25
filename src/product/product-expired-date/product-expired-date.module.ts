import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductExpiredDateService } from './product-expired-date.service';
import { ProductExpiredDateEntity } from './entity/product-expired-date.entity';

const providers = [
	{
		provide: 'PRODUCT_EXPIRED_DATE_SERVICE',
		useClass: ProductExpiredDateService
	}
];
const imports = [TypeOrmModule.forFeature([ProductExpiredDateEntity])];

@Module({
	imports,
	providers
})
export class ProductExpiredDateModule {}
