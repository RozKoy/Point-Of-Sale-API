import { 
	Entity, 
	Column
} from 'typeorm';

import { ParentEntity } from 'src/entity/parent';

@Entity('product')
export class ProductEntity extends ParentEntity {
	@Column({ length: 36 })
	author: string;

	@Column({ unique: true })
	name: string;

	@Column({ type: 'text' })
	image: string;
}