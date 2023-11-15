import { 
	Entity,
	Column,
	ManyToOne,
	JoinColumn
} from 'typeorm';

import { ParentEntity } from 'src/entity/parent';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { UnitEntity } from 'src/product/unit/entity/unit.entity';
import { ProductEntity } from 'src/product/product/entity/product.entity';

@Entity('product_unit_group')
export class ProductUnitGroupEntity extends ParentEntity {
	@ManyToOne(() => AdminEntity)
	@JoinColumn({ name: 'author' })
	author: AdminEntity;

	@ManyToOne(() => ProductEntity)
	@JoinColumn({ name: 'product' })
	product: ProductEntity;

	@ManyToOne(() => UnitEntity)
	@JoinColumn({ name: 'unit' })
	unit: UnitEntity;
}