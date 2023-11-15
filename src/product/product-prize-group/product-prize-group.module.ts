import { Module } from '@nestjs/common';

import { ProductPrizeGroupService } from './product-prize-group.service';

const providers = [
  {
    provide: 'PRODUCT_PRIZE_GROUP_SERVICE',
    useClass: ProductPrizeGroupService
  }
];

@Module({
  providers
})
export class ProductPrizeGroupModule {}
