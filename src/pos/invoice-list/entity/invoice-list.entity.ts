import { 
	Entity,
	Column,
	ManyToOne,
	JoinColumn
} from 'typeorm';

import { ParentEntity } from 'src/entity/parent';
import { InvoiceEntity } from 'src/pos/invoice/entity/invoice.entity';
import { ProductUnitEntity } from 'src/product-group/product-unit/entity/product-unit.entity';

@Entity('invoice_list')
export class InvoiceListEntity extends ParentEntity {
	@Column()
	quantity: string;

	@Column()
	sum: string;

	@ManyToOne(() => InvoiceEntity)
	@JoinColumn({ name: 'invoice' })
	invoice: InvoiceEntity;

	@ManyToOne(() => ProductUnitEntity)
	@JoinColumn({ name: 'unit' })
	unit: ProductUnitEntity;
}