import { 
	Inject, 
	Injectable,
	HttpStatus,
	HttpException
} from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { CashierService } from 'src/user/cashier/cashier.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor (
		private configService: ConfigService,
		@Inject('CASHIER_SERVICE') private readonly cashierService: CashierService
	) {
		super(configService.get('jwtStrategy'));
	}

	async validate (payload: any) {
		const cashier = await this.cashierService.getCashierById(payload.sub);

		if (cashier) {
			return cashier;
		}

		throw new HttpException('Kasir tidak ditemukan', HttpStatus.UNAUTHORIZED);
	}
}