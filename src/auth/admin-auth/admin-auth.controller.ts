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
	NewPasswordDto,
	OtpVerificationDto,
	RefreshAccessTokenDto 
} from './dto';
import { 
	RESPONSE,
	RESPONSE_I,
	AdminGuard,
	LoginResponseI
} from 'src/utils';
import { SerializedAdmin } from 'src/user/admin/type';
import { AdminAuthService } from './admin-auth.service';

@ApiTags('Admin Authentication')
@Controller('auth/admin')
export class AdminAuthController {
	constructor (
		@Inject('AUTH_ADMIN_SERVICE') private readonly adminAuthService: AdminAuthService
	) {}

	// UTILS
	@Post('/login')
	async login (@Body() loginDto: LoginDto): Promise<RESPONSE_I> {
		const { email, password } = loginDto;
		const response: LoginResponseI | null = await this.adminAuthService.login(email, password);

		if (response) {
			return RESPONSE(response, 'Berhasil melakukan login', HttpStatus.OK);
		}

		throw new HttpException('Email atau password salah', HttpStatus.UNAUTHORIZED);
	}

	@Post('/forget-password')
	async forgetPassword (@Body() emailDto: EmailDto): Promise<RESPONSE_I> {
		const { email } = emailDto;
		const admin = await this.adminAuthService.sendOtp(email);

		if (admin) {
			return RESPONSE(new SerializedAdmin(admin), 'Berhasil mengirimkan kode otp', HttpStatus.ACCEPTED);
		}

		throw new HttpException('Admin tidak ditemukan', HttpStatus.NOT_FOUND);
	}

	@Post('/otp-verification')
	async otpVerification (@Body() otpVerificationDto: OtpVerificationDto): Promise<RESPONSE_I> {
		const { email, otp } = otpVerificationDto;
		const check: boolean = await this.adminAuthService.checkOtp(email, otp);

		if (check) {
			return RESPONSE(otpVerificationDto, 'Kode otp terverifikasi', HttpStatus.OK);	
		}

		throw new HttpException('Kode otp tidak sesuai', HttpStatus.NOT_FOUND);	
	}

	@Post('/create-new-password')
	async newPassword (@Body() newPasswordDto: NewPasswordDto): Promise<RESPONSE_I> {
		const { password, password_confirmation } = newPasswordDto;

		if (password === password_confirmation) {
			const { email, otp } = newPasswordDto;
			const check: boolean = await this.adminAuthService.checkOtp(email, otp);

			if (check) {
				const makeNewPassword: string | null = await this.adminAuthService.changeAdminPassword(email, password);

				if (makeNewPassword) {
					return RESPONSE(makeNewPassword, 'Berhasil membuat kata sandi baru', HttpStatus.CREATED);
				}
			}

			throw new HttpException('Email atau otp tidak sesuai', HttpStatus.NOT_FOUND);		
		}

		throw new HttpException([{ property: 'password_confirmation', message: 'Konfirmasi kata sandi tidak sesuai' }], HttpStatus.BAD_REQUEST);	
	}





	@Post('/refresh-access-token')
	async refreshAccessToken (@Body() refreshAccessTokenDto: RefreshAccessTokenDto): Promise<RESPONSE_I> {
		const response: any = await this.adminAuthService.refreshAccessToken(refreshAccessTokenDto);

		if (response) {
			if (response === 'expired') {
				throw new HttpException('Refresh token tidak dapat digunakan lagi', HttpStatus.FORBIDDEN);
			} else if (response === 'error') {
				throw new HttpException('Oops... Terjadi kesalahan didalam server', HttpStatus.INTERNAL_SERVER_ERROR);
			}
			
			return RESPONSE(response, 'Berhasil memperbarui access token', HttpStatus.OK);
		}

		throw new HttpException('Refresh token tidak terverifikasi', HttpStatus.NOT_FOUND);
	}

	@Patch('/:id/revoke')
	@UseGuards(AdminGuard)
	async revokeRefreshToken (@Param('id') id: string) {
		const response: any | null = await this.adminAuthService.revokeRefreshToken(id);
		
		if (response) {
			return RESPONSE(response, 'Berhasil mencabut refresh token', HttpStatus.ACCEPTED);
		}

		throw new HttpException('Gagal mencabut refresh token', HttpStatus.NOT_FOUND);
	}
}
