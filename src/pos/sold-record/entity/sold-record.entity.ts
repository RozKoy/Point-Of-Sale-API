import { 
	Entity,
	Column,
	ManyToOne,
	JoinColumn
} from 'typeorm';

import { ParentEntity } from 'src/entity/parent';
import { ProductEntity } from 'src/product/product/entity/product.entity';

@Entity('product_sold_record')
export class SoldRecordEntity extends ParentEntity {
	@Column()
	count: string;

	@ManyToOne(() => ProductEntity)
	@JoinColumn({ name: 'product' })
	product: ProductEntity;
}