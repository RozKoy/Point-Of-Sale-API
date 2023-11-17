import { 
	Entity,
	Column,
	ManyToMany,
	JoinColumn
} from 'typeorm';

import { ParentEntity } from 'src/entity/parent';
import { InvoiceEntity } from 'src/pos/invoice/entity/invoice.entity';
import { InvoiceListEntity } from 'src/pos/invoice-list/entity/invoice-list.entity';

@Entity('invoice_group')
export class InvoiceGroupEntity extends ParentEntity {
	@ManyToMany(() => InvoiceEntity)
	@JoinColumn({ name: 'invoice' })
	invoice: InvoiceEntity;

	@ManyToMany(() => InvoiceListEntity)
	@JoinColumn({ name: 'invoice_list' })
	invoice_list: InvoiceListEntity;
}