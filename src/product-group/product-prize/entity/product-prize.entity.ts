import { 
	Entity,
	OneToOne,
	ManyToOne,
	JoinColumn
} from 'typeorm';

import { ParentEntity } from 'src/entity/parent';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { PrizeEntity } from 'src/product/prize/entity/prize.entity';
import { ProductUnitEntity } from 'src/product-group/product-unit/entity/product-unit.entity';

@Entity('product_prize_group')
export class ProductPrizeEntity extends ParentEntity {
	@ManyToOne(() => AdminEntity)
	@JoinColumn({ name: 'author' })
	author: AdminEntity;

	@ManyToOne(() => PrizeEntity)
	@JoinColumn({ name: 'prize' })
	prize: PrizeEntity;

	@OneToOne(() => ProductUnitEntity)
	@JoinColumn({ name: 'unit' })
	unit: ProductUnitEntity;
}