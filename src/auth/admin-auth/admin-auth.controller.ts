import { 
	Post,
	Body,
	Patch,
	Param,
	Inject, 
	UseGuards,
	Controller,
	HttpStatus,
	HttpException
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/utils';
import { AdminAuthService } from './admin-auth.service';
import { LoginDto, RefreshAccessTokenDto } from './dto';

@ApiTags('Admin Authentication')
@Controller('auth/admin')
export class AdminAuthController {
	constructor (
		@Inject('AUTH_ADMIN_SERVICE') private readonly adminAuthService: AdminAuthService
	) {}

	@Post('/login')
	async login (@Body() loginDto: LoginDto): Promise<{ access_token: string, refresh_token: string }> {
		const response: { access_token: string, refresh_token: string } | null = await this.adminAuthService.login(loginDto);

		if (response) {
			return response;
		}

		throw new HttpException('Email atau password salah', HttpStatus.UNAUTHORIZED);
	}

	@Post('/refresh-access-token')
	async refreshAccessToken (@Body() refreshAccessTokenDto: RefreshAccessTokenDto): Promise<{ access_token: string, refresh_token: string }> {
		const response: any = await this.adminAuthService.refreshAccessToken(refreshAccessTokenDto);

		if (response) {
			if (response === 'expired') {
				throw new HttpException('Refresh token tidak dapat digunakan lagi', HttpStatus.UNAUTHORIZED);
			} else if (response === 'error') {
				throw new HttpException('Oops... Terjadi kesalahan didalam server', HttpStatus.INTERNAL_SERVER_ERROR);
			}
			
			return response;
		}

		throw new HttpException('Refresh token tidak terverifikasi', HttpStatus.NOT_FOUND);
	}

	@Patch('/:id/revoke')
	@UseGuards(JwtGuard)
	async revokeRefreshToken (@Param('id') id: string) {
		await this.adminAuthService.revokeRefreshToken(id);
	}
}
