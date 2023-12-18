import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductUnitService } from './product-unit.service';
import { ProductUnitEntity } from './entity/product-unit.entity';

const providers = [
{
	provide: 'PRODUCT_UNIT_SERVICE',
	useClass: ProductUnitService
}
];
const imports = [TypeOrmModule.forFeature([ProductUnitEntity])];

@Module({
	imports,
	providers,
	exports: providers
})
export class ProductUnitModule {}
