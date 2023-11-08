import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SerializedAdmin } from './type';
import { encodePassword } from 'src/utils/bcryptjs';
import { CreateAdminDto, UpdateAdminDto } from './dto';
import { AdminEntity, AdminRole } from './entity/admin.entity';

@Injectable()
export class AdminService {
	constructor (
		@InjectRepository(AdminEntity) private readonly adminRepository: Repository<AdminEntity>
	) {}

	// CREATE
	async createAdmin (createAdminDto: CreateAdminDto, role: AdminRole): Promise<SerializedAdmin> {
		const { password, salt } = encodePassword(createAdminDto.password);
		const makeSuperAdmin: AdminEntity = await this.adminRepository.create({ 
			...createAdminDto, 
			role,
			salt,
			password
		});
		const newSuperAdmin: AdminEntity = await this.adminRepository.save(makeSuperAdmin)

		return new SerializedAdmin(newSuperAdmin);
	}

	// READ
	async getAdminByEmail (email: string): Promise<SerializedAdmin | null> {
		const admin: AdminEntity = await this.adminRepository.findOneBy({ email });
		
		if (admin) {
			return new SerializedAdmin(admin);
		}
		return null;
	}

	async getAdminByRole (role: AdminRole): Promise<SerializedAdmin[]> {
		const admins: AdminEntity[] = await this.adminRepository.findBy({ role });

		if (admins.length !== 0) {
			return admins.map((admin) => new SerializedAdmin(admin));
		}

		return [];
	}

	async getAdminById (id: string): Promise<SerializedAdmin | null> {
		const admin: AdminEntity = await this.adminRepository.findOneBy({ id });
		
		if (admin) {
			return new SerializedAdmin(admin);
		}
		return null;	
	}

	async getTrashedAdminById (id: string): Promise<SerializedAdmin | null> {
		const admin: AdminEntity = await this.adminRepository.findOne({ where: { id }, withDeleted: true });

		if (admin) {
			return new SerializedAdmin(admin);
		}

		return null;
	}

	// UPDATE
	async updateAdmin (id: string, updateAdminDto: UpdateAdminDto): Promise<SerializedAdmin> {
		const admin: AdminEntity = await this.adminRepository.findOneBy({ id });

		const { email, username, image, password } = updateAdminDto;
		
		admin.username = username ? username : admin.username;
		admin.email = email ? email : admin.email;
		admin.image = image ? image : admin.image;

		if (password) {
			const newPassword: { password: string, salt: string } = encodePassword(password);
			admin.password = newPassword.password;
			admin.salt = newPassword.salt;
		}

		const updatedAdmin: AdminEntity = await this.adminRepository.save(admin);
		return new SerializedAdmin(updatedAdmin);
	}

	// DELETE
	async deleteAdminById (id: string): Promise<any> {
		return await this.adminRepository.softDelete(id);
	}

	// RESTORE
	async restoreAdminById (id: string): Promise<any> {
		return await this.adminRepository.restore(id);
	}
}