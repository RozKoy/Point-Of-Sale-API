import { 
	Entity,
	Column,
	OneToOne,
	ManyToOne,
	JoinColumn
} from 'typeorm';

import { ParentEntity } from 'src/entity/parent';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { CashierEntity } from 'src/user/cashier/entity/cashier.entity';

@Entity('cash_on_hand')
export class CashOnHandEntity extends ParentEntity {
	@Column()
	cash_on_hand: string;

	@ManyToOne(() => AdminEntity)
	@JoinColumn({ name: 'author' })
	author: AdminEntity;

	@ManyToOne(() => CashierEntity)
	@JoinColumn({ name: 'cashier' })
	cashier: CashierEntity;
}