import { 
	Entity,
	Column,
	ManyToOne,
	JoinColumn
} from 'typeorm';

import { ParentEntity } from 'src/entity/parent';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';
import { StockEntity } from 'src/inventory/stock/entity/stock.entity';

export enum Mode {
	PLUS = 'plus',
	MIN = 'min'
}

@Entity('stock_record')
export class StockRecordEntity extends ParentEntity {
	@Column()
	value: string;

	@Column({ type: 'enum', enum: Mode, default: Mode.PLUS })
	mode: Mode;

	@ManyToOne(() => AdminEntity)
	@JoinColumn({ name: 'author' })
	author: AdminEntity;

	@ManyToOne(() => StockEntity)
	@JoinColumn({ name: 'stock' })
	stock: StockEntity;
}