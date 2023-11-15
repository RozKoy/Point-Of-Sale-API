import { Module } from '@nestjs/common';

import { ProductCategoryGroupService } from './product-category-group.service';

const providers = [
  {
    provide: 'PRODUCT_CATEGORY_GROUP_SERVICE',
    useClass: ProductCategoryGroupService
  }
];

@Module({
  providers
})
export class ProductCategoryGroupModule {}
