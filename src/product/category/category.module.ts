import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryService } from './category.service';
import { CategoryEntity } from './entity/category.entity';

const providers = [
  {
    provide: 'CATEGORY_SERVICE',
    useClass: CategoryService
  }
];
const imports = [TypeOrmModule.forFeature([CategoryEntity])];

@Module({
  imports,
  providers
})
export class CategoryModule {}
