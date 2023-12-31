import { 
	Entity, 
	Column,
	OneToMany
} from 'typeorm';

import { ParentEntity } from 'src/entity/parent';
import { CashierAuthEntity } from 'src/auth/cashier-auth/entity/cashier-auth.entity';

@Entity('cashier')
export class CashierEntity extends ParentEntity {
	@Column({ unique: true })
	username: string;

	@Column({ type: 'char', length: 6, unique: true })
	code: string;

	@Column({ type: 'text' })
	image: string;

	@OneToMany(() => CashierAuthEntity, (auth) => auth.cashier)
	refresh_tokens: CashierAuthEntity[];
}