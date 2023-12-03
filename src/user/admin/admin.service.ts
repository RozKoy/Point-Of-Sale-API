import {
	paginate,
	Pagination,
	IPaginationOptions
} from 'nestjs-typeorm-paginate';
import { Like, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { 
	FilterDto, 
	CreateAdminDto, 
	UpdateAdminDto 
} from './dto';
import { encodePassword } from 'src/utils';
import { AdminEntity, AdminRole } from './entity/admin.entity';

@Injectable()
export class AdminService {
	constructor (
		@InjectRepository(AdminEntity) 
		private readonly adminRepository: Repository<AdminEntity>
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

	async setOtp (email: string, otp: string | null): Promise<string> {
		const admin: AdminEntity = await this.adminRepository.findOneBy({ email });
		
		admin.otp = otp;
		await this.adminRepository.save(admin);
		
		return otp;
	}

	// CREATE
	async createAdmin (createAdminDto: CreateAdminDto, role: AdminRole): Promise<AdminEntity> {
		const { password, salt } = encodePassword(createAdminDto.password);
		const makeAdmin: AdminEntity = await this.adminRepository.create({ 
			...createAdminDto, 
			role,
			salt,
			password
		});
		const newAdmin: AdminEntity = await this.adminRepository.save(makeAdmin);

		return newAdmin;
	}

	// READ
	async getAdminByEmail (email: string): Promise<AdminEntity | null> {
		return await this.adminRepository.findOneBy({ email });
	}

	async getTrashedAdminByEmail (email: string): Promise<AdminEntity | null> {
		return await this.adminRepository.findOne({ where: { email }, withDeleted: true });
	}

	async getAdminByRole (role: AdminRole, filterDto: FilterDto): Promise<Pagination<AdminEntity>> {
		const { page, limit, search } = filterDto;
		const options: IPaginationOptions = {
			page: page || 1,
			limit: limit || 5
		};

		if (search) {
			return await paginate<AdminEntity>(this.adminRepository, options, {
				where: [
					{ role, email: Like(`%${ search }%`) },
					{ role, username: Like(`%${ search }%`) }
				],
				order: {
					update_at: 'DESC'
				}
			});
		}

		return await paginate<AdminEntity>(this.adminRepository, options, {
			where: { role },
			order: { update_at: 'DESC' }
		});
	}
	
	async getAdminById (id: string): Promise<AdminEntity | null> {
		return await this.adminRepository.findOneBy({ id });
	}

	async getTrashedAdminById (id: string): Promise<AdminEntity | null> {
		return await this.adminRepository.findOne({ where: { id }, withDeleted: true });
	}

	// UPDATE
	async updateAdmin (updateAdminDto: UpdateAdminDto): Promise<AdminEntity> {
		const { id, email, username, image, password } = updateAdminDto;

		const admin: AdminEntity = await this.adminRepository.findOneBy({ id });

		admin.email = email ? email : admin.email;
		admin.image = image ? image : admin.image;
		admin.username = username ? username : admin.username;

		if (password) {
			const newPassword: { password: string, salt: string } = encodePassword(password);
			admin.password = newPassword.password;
			admin.salt = newPassword.salt;
		}

		return await this.adminRepository.save(admin);
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