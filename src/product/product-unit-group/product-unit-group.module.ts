import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductUnitGroupService } from './product-unit-group.service';
import { ProductUnitGroupEntity } from './entity/product-unit-group.entity';

const providers = [
  {
    provide: 'PRODUCT_UNIT_GROUP_SERVICE',
    useClass: ProductUnitGroupService
  }
];
const imports = [TypeOrmModule.forFeature([ProductUnitGroupEntity])];

@Module({
  imports,
  providers
})
export class ProductUnitGroupModule {}
