import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';

const providers = [
  {
    provide: 'CATEGORY_SERVICE',
    useClass: CategoryService
  }
];

@Module({
  providers
})
export class CategoryModule {}
