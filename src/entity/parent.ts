import { 
	BaseEntity,
	CreateDateColumn, 
	UpdateDateColumn, 
	DeleteDateColumn, 
	PrimaryGeneratedColumn
} from 'typeorm';

export abstract class ParentEntity extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@CreateDateColumn()
	create_at: Date;

	@UpdateDateColumn()
	update_at: Date;

	@DeleteDateColumn()
	delete_at: Date;
}