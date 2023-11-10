import { Module } from '@nestjs/common';

import { ProductService } from './product.service';
import { ProductController } from './product.controller';

const providers = [
	{
		provide: 'PRODUCT_SERVICE',
		useClass: ProductService
	}
];

@Module({
  providers,
  controllers: [ProductController]
})
export class ProductModule {}
