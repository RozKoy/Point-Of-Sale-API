import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductService } from './product.service';
import { ProductEntity } from './entity/product.entity';
import { ProductController } from './product.controller';

const providers = [
	{
		provide: 'PRODUCT_SERVICE',
		useClass: ProductService
	}
];
const controllers = [ProductController];
const imports = [TypeOrmModule.forFeature([ProductEntity])];

@Module({
	imports,
  providers,
  controllers,
})
export class ProductModule {}
