import { 
	Entity,
	ManyToOne,
	JoinColumn
} from 'typeorm';

import { ParentEntity } from 'src/entity/parent';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { UnitEntity } from 'src/product/unit/entity/unit.entity';
import { ProductEntity } from 'src/product/product/entity/product.entity';

@Entity('product_unit_group')
export class ProductUnitEntity extends ParentEntity {
	@ManyToOne(() => AdminEntity)
	@JoinColumn({ name: 'author' })
	author: AdminEntity;

	@ManyToOne(() => UnitEntity)
	@JoinColumn({ name: 'unit' })
	unit: UnitEntity;

	@ManyToOne(() => ProductEntity)
	@JoinColumn({ name: 'product' })
	product: ProductEntity;
}