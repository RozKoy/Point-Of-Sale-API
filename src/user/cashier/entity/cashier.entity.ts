import { 
	Entity, 
	Column
} from 'typeorm';

import { ParentEntity } from 'src/entity/parent';

@Entity('cashier')
export class CashierEntity extends ParentEntity {
	@Column({ length: 36 })
	author: string;

	@Column({ unique: true })
	username: string;

	@Column({ type: 'char', length: 6, unique: true })
	code: string;

	@Column({ type: 'text' })
	image: string;
}