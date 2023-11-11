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

import { 
	EmailDto,
	LoginDto,
	LoginResponseI,
	NewPasswordDto,
	OtpVerificationDto,
	RefreshAccessTokenDto 
} from './dto';
import { JwtGuard } from 'src/utils';
import { AdminAuthService } from './admin-auth.service';

@ApiTags('Admin Authentication')
@Controller('auth/admin')
export class AdminAuthController {
	constructor (
		@Inject('AUTH_ADMIN_SERVICE') private readonly adminAuthService: AdminAuthService
	) {}

	// UTILS
	@Post('/login')
	async login (@Body() loginDto: LoginDto): Promise<void> {
		const { email, password } = loginDto;
		const response: LoginResponseI | null = await this.adminAuthService.login(email, password);

		if (response) {
			throw new HttpException(response, HttpStatus.OK);
		}

		throw new HttpException('Email atau password salah', HttpStatus.UNAUTHORIZED);
	}

	@Post('/forget-password')
	async forgetPassword (@Body() emailDto: EmailDto): Promise<void> {
		const { email } = emailDto;
		const admin = await this.adminAuthService.sendOtp(email);

		if (admin) {
			delete admin.id;
			delete admin.salt;
			delete admin.password;
			throw new HttpException(admin, HttpStatus.ACCEPTED);
		}

		throw new HttpException('Admin tidak ditemukan', HttpStatus.NOT_FOUND);
	}

	@Post('/otp-verification')
	async otpVerification (@Body() otpVerificationDto: OtpVerificationDto): Promise<void> {
		const { email, otp } = otpVerificationDto;
		const check: boolean = await this.adminAuthService.checkOtp(email, otp);

		if (check) {
			throw new HttpException(otpVerificationDto, HttpStatus.OK);	
		}

		throw new HttpException('Kode otp tidak sesuai', HttpStatus.NOT_FOUND);	
	}

	@Post('/create-new-password')
	async newPassword (@Body() newPasswordDto: NewPasswordDto) {
		const { password, password_confirmation } = newPasswordDto;

		if (password === password_confirmation) {
			const { email, otp } = newPasswordDto;
			const check: boolean = await this.adminAuthService.checkOtp(email, otp);

			if (check) {
				const makeNewPassword: string | null = await this.adminAuthService.changeAdminPassword(email, password);

				if (makeNewPassword) {
					throw new HttpException(makeNewPassword, HttpStatus.CREATED);			
				}
			}

			throw new HttpException('Email atau otp tidak sesuai', HttpStatus.NOT_FOUND);		
		}

		throw new HttpException([{ property: 'password_confirmation', message: 'Konfirmasi kata sandi tidak sesuai' }], HttpStatus.BAD_REQUEST);	
	}





	@Post('/refresh-access-token')
	async refreshAccessToken (@Body() refreshAccessTokenDto: RefreshAccessTokenDto): Promise<LoginResponseI> {
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
