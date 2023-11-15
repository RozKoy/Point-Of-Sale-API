import { 
	Entity,
	Column,
	ManyToOne,
	JoinColumn
} from 'typeorm';

import { ParentEntity } from 'src/entity/parent';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { ProductEntity } from 'src/product/product/entity/product.entity';
import { CategoryEntity } from 'src/product/category/entity/category.entity';

@Entity('product_category_group')
export class ProductCategoryGroupEntity extends ParentEntity {
	@ManyToOne(() => AdminEntity)
	@JoinColumn({ name: 'author' })
	author: AdminEntity;

	@ManyToOne(() => ProductEntity)
	@JoinColumn({ name: 'product' })
	product: ProductEntity;

	@ManyToOne(() => CategoryEntity)
	@JoinColumn({ name: 'category' })
	category: CategoryEntity;
}