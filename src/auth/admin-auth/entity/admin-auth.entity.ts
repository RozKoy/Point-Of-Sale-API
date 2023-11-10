import { 
	Entity, 
	Column,
	ManyToOne
} from 'typeorm';

import { ParentEntity } from 'src/entity/parent';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';

@Entity('admin_refresh_token')
export class AdminAuthEntity extends ParentEntity {
	@Column({ type: 'timestamp' })
	expired_at: Date;

	@ManyToOne(() => AdminEntity, (admin) => admin.refresh_tokens)
	admin: AdminEntity;
}