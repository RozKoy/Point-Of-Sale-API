import { Module } from '@nestjs/common';

import { ProductUnitGroupService } from './product-unit-group.service';

const providers = [
  {
    provide: 'PRODUCT_UNIT_GROUP_SERVICE',
    useClass: ProductUnitGroupService
  }
];

@Module({
  providers
})
export class ProductUnitGroupModule {}
