import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductCategoryService } from './product-category.service';
import { ProductCategoryEntity } from './entity/product-category.entity';

const providers = [
	{
		provide: 'PRODUCT_CATEGORY_SERVICE',
		useClass: ProductCategoryService
	}
];
const imports = [TypeOrmModule.forFeature([ProductCategoryEntity])];

@Module({
	imports,
	providers
})
export class ProductCategoryModule {}
