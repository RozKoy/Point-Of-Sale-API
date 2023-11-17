import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductCategoryGroupService } from './product-category-group.service';
import { ProductCategoryGroupEntity } from './entity/product-category-group.entity';

const providers = [
  {
    provide: 'PRODUCT_CATEGORY_GROUP_SERVICE',
    useClass: ProductCategoryGroupService
  }
];
const imports = [TypeOrmModule.forFeature([ProductCategoryGroupEntity])];

@Module({
  imports,
  providers
})
export class ProductCategoryGroupModule {}
