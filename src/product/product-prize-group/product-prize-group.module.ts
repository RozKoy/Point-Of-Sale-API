import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductPrizeGroupService } from './product-prize-group.service';
import { ProductPrizeGroupEntity } from './entity/product-prize-group.entity';

const providers = [
  {
    provide: 'PRODUCT_PRIZE_GROUP_SERVICE',
    useClass: ProductPrizeGroupService
  }
];
const imports = [TypeOrmModule.forFeature([ProductPrizeGroupEntity])];

@Module({
  imports,
  providers
})
export class ProductPrizeGroupModule {}
