import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';

import { TokenExpiredError } from 'jsonwebtoken';
import { LoginDto, RefreshAccessTokenDto } from './dto';
import { AdminService } from 'src/user/admin/admin.service';
import { AdminAuthEntity } from './entity/admin-auth.entity';
import { AdminEntity } from 'src/user/admin/entity/admin.entity';

@Injectable()
export class AdminAuthService {
	constructor (
		private readonly jwtService: JwtService,
		@Inject('ADMIN_SERVICE') private readonly adminService: AdminService,
		@InjectRepository(AdminAuthEntity) private readonly adminAuthRepository: Repository<AdminAuthEntity>
	) {}

	// UTILS
	async login (loginDto: LoginDto): Promise<{ access_token: string, refresh_token: string } | null> {
		const { email, password } = loginDto;
		const admin: AdminEntity = await this.adminService.validateAdmin(email, password);

		if (admin) {
			const access_token: string = await this.createAccessToken(admin);
			const refresh_token: string = await this.createRefreshToken(admin);

			return { access_token, refresh_token };
		}

		return null;
	}

	async createAccessToken (admin: AdminEntity): Promise<string> {
		const payload = {
			sub: admin.id
		};

		return await this.jwtService.signAsync(payload);
	}

	async createRefreshToken (admin: AdminEntity): Promise<string> {
		const expiresIn: number = 86400;
		const adminAuth: AdminAuthEntity = await this.createAdminAuth(admin, expiresIn);

		const payload = {
			sub: adminAuth.id
		};

		return await this.jwtService.signAsync(payload, { expiresIn });
	}

	async refreshAccessToken (refreshAccessTokenDto: RefreshAccessTokenDto): Promise<any> {
		const { refresh_token } = refreshAccessTokenDto;
		const payload: any = await this.tokenVerification(refresh_token);

		if (payload === 'expired' || payload === 'error') {
			return payload;
		}
		
		const id: string = payload.sub;
		const adminAuth: AdminAuthEntity = await this.adminAuthRepository.findOne({ where: { id }, relations: { admin: true } });

		if (adminAuth) {
			const access_token: string = await this.createAccessToken(adminAuth.admin);

			return { access_token, refresh_token };
		}

		return null;
	}

	async tokenVerification (token: string): Promise<any> {
		try {
			return await this.jwtService.verifyAsync(token);
		} catch (e) {
			if (e instanceof TokenExpiredError) {
				return 'expired';
			} else {
				return 'error';
			}
		}
	}

	async revokeRefreshToken (id: string) {
		const adminAuth = await this.adminAuthRepository.findOneBy({ id });

		if (adminAuth) {
			return await this.deleteAdminAuth(id);
		}

		return null;
	}

	// CREATE
	async createAdminAuth (admin: AdminEntity, expiresIn: number): Promise<AdminAuthEntity> {
		const expired_at: Date = new Date();
		expired_at.setTime(expired_at.getTime() + expiresIn);

		const makeRefreshToken: AdminAuthEntity = await this.adminAuthRepository.create({
			admin,
			expired_at
		});

		return await this.adminAuthRepository.save(makeRefreshToken);	
	}

	// DELETE
	async deleteAdminAuth (id: string) {
		return await this.adminAuthRepository.softDelete(id);
	}
}
