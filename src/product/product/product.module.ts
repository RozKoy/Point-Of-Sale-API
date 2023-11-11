import { Module } from '@nestjs/common';

import { ProductService } from './product.service';
import { ProductController } from './product.controller';

const providers = [
	{
		provide: 'PRODUCT_SERVICE',
		useClass: ProductService
	}
];
const controllers = [ProductController];

@Module({
  providers,
  controllers,
})
export class ProductModule {}
