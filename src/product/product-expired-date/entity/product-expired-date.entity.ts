import { 
	Entity,
	Column,
	OneToOne,
	ManyToOne,
	JoinColumn
} from 'typeorm';

import { ParentEntity } from 'src/entity/parent';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { ProductEntity } from 'src/product/product/entity/product.entity';

@Entity('product_expired_date')
export class ProductExpiredDateEntity extends ParentEntity {
	@Column({ type: 'timestamp' })
	expired_at: Date;

	@ManyToOne(() => AdminEntity)
	@JoinColumn({ name: 'author' })
	author: AdminEntity;

	@ManyToOne(() => ProductEntity)
	@JoinColumn({ name: 'product' })
	product: ProductEntity;
}