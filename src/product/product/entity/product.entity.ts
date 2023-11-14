import { 
	Entity, 
	Column,
	ManyToOne,
	JoinColumn
} from 'typeorm';

import { ParentEntity } from 'src/entity/parent';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';

@Entity('product')
export class ProductEntity extends ParentEntity {
	@Column({ unique: true })
	name: string;

	@Column({ type: 'text' })
	image: string;

	@ManyToOne(() => AdminEntity, (admin) => admin.products)
	@JoinColumn({ name: 'author' })
	author: AdminEntity;
}