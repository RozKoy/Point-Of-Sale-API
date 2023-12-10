import { 
	Entity,
	OneToOne,
	ManyToOne,
	JoinColumn
} from 'typeorm';

import { ParentEntity } from 'src/entity/parent';
import { InvoiceEntity } from 'src/pos/invoice/entity/invoice.entity';
import { CashierEntity } from 'src/user/cashier/entity/cashier.entity';

@Entity('invoice_draft')
export class InvoiceDraftEntity extends ParentEntity {
	@ManyToOne(() => CashierEntity)
	@JoinColumn({ name: 'cashier' })
	cashier: CashierEntity;

	@OneToOne(() => InvoiceEntity)
	@JoinColumn({ name: 'invoice' })
	invoice: InvoiceEntity;
}