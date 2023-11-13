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
	RESPONSE, 
	RESPONSE_I, 
	CashierGuard,
	LoginResponseI 
} from 'src/utils';
import { CodeDto, RefreshAccessTokenDto } from './dto';
import { CashierAuthService } from './cashier-auth.service';

@ApiTags('Cashier Authentication')
@Controller('auth/cashier')
export class CashierAuthController {
	constructor (
		@Inject('AUTH_CASHIER_SERVICE') 
		private readonly cashierAuthService: CashierAuthService
	) {}

	// UTILS
	@Post('/login')
	async login (@Body() codeDto: CodeDto): Promise<RESPONSE_I> {
		const { code } = codeDto;
		const response: LoginResponseI | null = await this.cashierAuthService.login(code);

		if (response) {
			return RESPONSE(response, 'Berhasil melakukan login', HttpStatus.OK);
		}

		throw new HttpException('Email atau password salah', HttpStatus.UNAUTHORIZED);
	}

	@Post('/refresh-access-token')
	async refreshAccessToken (@Body() refreshAccessTokenDto: RefreshAccessTokenDto): Promise<RESPONSE_I> {
		const response: any = await this.cashierAuthService.refreshAccessToken(refreshAccessTokenDto);

		if (response) {
			if (response === 'expired') {
				throw new HttpException('Refresh token tidak dapat digunakan lagi', HttpStatus.UNAUTHORIZED);
			} else if (response === 'error') {
				throw new HttpException('Oops... Terjadi kesalahan didalam server', HttpStatus.INTERNAL_SERVER_ERROR);
			}
			
			return RESPONSE(response, 'Berhasil memperbarui access token', HttpStatus.OK);
		}

		throw new HttpException('Refresh token tidak terverifikasi', HttpStatus.NOT_FOUND);
	}

	@Patch('/:id/revoke')
	@UseGuards(CashierGuard)
	async revokeRefreshToken (@Param('id') id: string): Promise<RESPONSE_I> {
		const response: any | null = await this.cashierAuthService.revokeRefreshToken(id);
		
		if (response) {
			return RESPONSE(response, 'Berhasil mencabut refresh token', HttpStatus.ACCEPTED);
		}

		throw new HttpException('Gagal mencabut refresh token', HttpStatus.NOT_FOUND);
	}
}
