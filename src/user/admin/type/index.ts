import { Exclude } from 'class-transformer';

import { AdminRole } from '../entity/admin.entity';

export class SerializedAdmin {	
	id?: string;
	otp?: string;
	email?: string;
	image?: string;
	create_at?: Date;
	update_at?: Date;
	delete_at?: Date;
	username?: string;

	@Exclude()
	salt?: string;
	@Exclude()
	role?: AdminRole;
	@Exclude()
	password?: string;
	
	constructor (partial: Partial<SerializedAdmin>) {
		Object.assign(this, partial);
	}
}