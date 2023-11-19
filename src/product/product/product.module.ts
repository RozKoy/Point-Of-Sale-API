import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductService } from './product.service';
import { ProductEntity } from './entity/product.entity';

const providers = [
	{
		provide: 'PRODUCT_SERVICE',
		useClass: ProductService
	}
];
const imports = [TypeOrmModule.forFeature([ProductEntity])];

@Module({
	imports,
	providers
})
export class ProductModule {}
