import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductPriceService } from './product-price.service';
import { ProductPriceEntity } from './entity/product-price.entity';

const providers = [
  {
    provide: 'PRODUCT_PRICE_SERVICE',
    useClass: ProductPriceService
  }
];
const imports = [TypeOrmModule.forFeature([ProductPriceEntity])];

@Module({
  imports,
  providers,
  exports: providers
})
export class ProductPriceModule {}
