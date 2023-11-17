import { 
	Entity,
	Column,
	ManyToOne,
	JoinColumn
} from 'typeorm';

import { ParentEntity } from 'src/entity/parent';
import { CashierEntity } from 'src/user/cashier/entity/cashier.entity';

@Entity('invoice')
export class InvoiceEntity extends ParentEntity {
	@Column()
	code: string;

	@Column()
	sum: string;

	@Column({ default: '0' })
	discount: string;

	@ManyToOne(() => CashierEntity)
	@JoinColumn({ name: 'author' })
	author: CashierEntity;
}