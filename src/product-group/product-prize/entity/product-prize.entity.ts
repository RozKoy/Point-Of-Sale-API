import { 
	Entity,
	Column,
	OneToOne,
	ManyToOne,
	JoinColumn
} from 'typeorm';

import { ParentEntity } from 'src/entity/parent';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { ProductUnitEntity } from 'src/product-group/product-unit/entity/product-unit.entity';

@Entity('product_prize_group')
export class ProductPrizeEntity extends ParentEntity {
	@Column()
	prize: string;

	@ManyToOne(() => AdminEntity)
	@JoinColumn({ name: 'author' })
	author: AdminEntity;

	@OneToOne(() => ProductUnitEntity)
	@JoinColumn({ name: 'unit' })
	unit: ProductUnitEntity;
}