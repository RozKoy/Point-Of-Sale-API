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

	@Column({ type: 'bigint', default: 0 })
	count: number;

	@ManyToOne(() => AdminEntity)
	@JoinColumn({ name: 'author' })
	author: AdminEntity;
}