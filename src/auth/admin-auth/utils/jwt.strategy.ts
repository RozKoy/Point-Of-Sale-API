import { 
	Inject, 
	Injectable,
	HttpStatus,
	HttpException
} from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { AdminService } from 'src/user/admin/admin.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor (
		private configService: ConfigService,
		@Inject('ADMIN_SERVICE') private readonly adminService: AdminService
	) {
		super(configService.get('jwtStrategy'));
	}

	async validate (payload: any) {
		const admin = await this.adminService.getAdminById(payload.sub);

		if (admin) {
			return admin;
		}

		throw new HttpException('Admin tidak ditemukan', HttpStatus.UNAUTHORIZED);
	}
}