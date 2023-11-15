import { 
	Entity,
	Column,
	OneToOne,
	ManyToOne,
	JoinColumn
} from 'typeorm';

import { ParentEntity } from 'src/entity/parent';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { PrizeEntity } from 'src/product/prize/entity/prize.entity';
import { ProductUnitGroupEntity } from 'src/product/product-unit-group/entity/product-unit-group.entity';

@Entity('product_prize_group')
export class ProductPrizeGroupEntity extends ParentEntity {
	@ManyToOne(() => AdminEntity)
	@JoinColumn({ name: 'author' })
	author: AdminEntity;

	@ManyToOne(() => PrizeEntity)
	@JoinColumn({ name: 'prize' })
	prize: PrizeEntity;

	@OneToOne(() => ProductUnitGroupEntity)
	@JoinColumn({ name: 'unit' })
	unit: ProductUnitGroupEntity;
}