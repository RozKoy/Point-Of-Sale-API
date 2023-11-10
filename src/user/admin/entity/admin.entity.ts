import { 
	Entity, 
	Column,
	OneToMany
} from 'typeorm';

import { ParentEntity } from 'src/entity/parent';
import { AdminAuthEntity } from 'src/auth/admin-auth/entity/admin-auth.entity';

export enum AdminRole {
	ADMIN = 'admin',
	SUPERADMIN = 'super_admin',
}

@Entity('admin')
export class AdminEntity extends ParentEntity {
	@Column()
	salt: string;

	@Column()
	username: string;

	@Column()
	password: string;

	@Column({ type: 'text' })
	image: string;

	@Column({ unique: true })
	email: string;

	@Column({ type: 'char', length: 6, nullable: true })
	otp: string;

	@Column({ type: 'enum', enum: AdminRole, default: AdminRole.ADMIN })
	role: AdminRole;

	@OneToMany(() => AdminAuthEntity, (auth) => auth.admin, { eager: true })
	refresh_tokens: AdminAuthEntity[];
}