import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { encodePassword } from 'src/utils';
import { CreateAdminDto, UpdateAdminDto } from './dto';
import { AdminEntity, AdminRole } from './entity/admin.entity';

@Injectable()
export class AdminService {
	constructor (
		@InjectRepository(AdminEntity) private readonly adminRepository: Repository<AdminEntity>
	) {}

	// UTILS
	async validateAdmin (email: string, password: string): Promise<AdminEntity | null> {
		const admin: AdminEntity = await this.adminRepository.findOneBy({ email });

		if (admin) {
			const checkPassword: boolean = await admin.validatePassword(password);

			if (checkPassword) {
				return admin;
			}
		}

		return null;
	}

	// CREATE
	async createAdmin (createAdminDto: CreateAdminDto, role: AdminRole): Promise<AdminEntity> {
		const { password, salt } = encodePassword(createAdminDto.password);
		const makeSuperAdmin: AdminEntity = await this.adminRepository.create({ 
			...createAdminDto, 
			role,
			salt,
			password
		});
		const newSuperAdmin: AdminEntity = await this.adminRepository.save(makeSuperAdmin)

		return newSuperAdmin;
	}

	// READ
	async getAdminByEmail (email: string): Promise<AdminEntity | null> {
		const admin: AdminEntity = await this.adminRepository.findOneBy({ email });
		
		if (admin) {
			return admin;
		}
		return null;
	}

	async getAdminByRole (role: AdminRole): Promise<AdminEntity[]> {
		const admins: AdminEntity[] = await this.adminRepository.findBy({ role });

		if (admins.length !== 0) {
			return admins;
		}

		return [];
	}
	
	async getAdminById (id: string): Promise<AdminEntity | null> {
		const admin: AdminEntity = await this.adminRepository.findOneBy({ id });
		
		if (admin) {
			return admin;
		}
		return null;	
	}

	async getTrashedAdminById (id: string): Promise<AdminEntity | null> {
		const admin: AdminEntity = await this.adminRepository.findOne({ where: { id }, withDeleted: true });

		if (admin) {
			return admin;
		}

		return null;
	}

	// UPDATE
	async updateAdmin (id: string, updateAdminDto: UpdateAdminDto): Promise<AdminEntity> {
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
		return updatedAdmin;
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