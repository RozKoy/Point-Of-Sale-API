import { 
	Entity,
	Column,
	OneToOne,
	ManyToOne,
	JoinColumn
} from 'typeorm';

import { ParentEntity } from 'src/entity/parent';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { InvoiceEntity } from 'src/pos/invoice/entity/invoice.entity';
import { CashierEntity } from 'src/user/cashier/entity/cashier.entity';

@Entity('invoice_delete_request')
export class InvoiceDeleteEntity extends ParentEntity {
	@Column()
	message: string;

	@ManyToOne(() => AdminEntity)
	@JoinColumn({ name: 'author' })
	author: AdminEntity;

	@ManyToOne(() => CashierEntity)
	@JoinColumn({ name: 'cashier' })
	cashier: CashierEntity;

	@OneToOne(() => InvoiceEntity)
	@JoinColumn({ name: 'invoice' })
	invoice: InvoiceEntity;
}