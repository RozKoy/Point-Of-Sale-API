import { 
	Entity, 
	Column,
	ManyToOne
} from 'typeorm';

import { ParentEntity } from 'src/entity/parent';
import { CashierEntity } from 'src/user/cashier/entity/cashier.entity';

@Entity('cashier_refresh_token')
export class CashierAuthEntity extends ParentEntity {
	@Column({ type: 'timestamp' })
	expired_at: Date;

	@ManyToOne(() => CashierEntity, (cashier) => cashier.refresh_tokens)
	cashier: CashierEntity;
}