import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductPrizeService } from './product-prize.service';
import { ProductPrizeEntity } from './entity/product-prize.entity';

const providers = [
  {
    provide: 'PRODUCT_PRIZE_SERVICE',
    useClass: ProductPrizeService
  }
];
const imports = [TypeOrmModule.forFeature([ProductPrizeEntity])];

@Module({
  imports,
  providers
})
export class ProductPrizeModule {}
