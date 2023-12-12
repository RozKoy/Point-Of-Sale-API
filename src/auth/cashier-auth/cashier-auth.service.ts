import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';

import { LoginResponseI } from 'src/utils';
import { RefreshAccessTokenDto } from './dto';
import { TokenExpiredError } from 'jsonwebtoken';
import { CashierAuthEntity } from './entity/cashier-auth.entity';
import { CashierService } from 'src/user/cashier/cashier.service';
import { CashierEntity } from 'src/user/cashier/entity/cashier.entity';

@Injectable()
export class CashierAuthService {
	constructor (
		private readonly jwtService: JwtService,
		@Inject('CASHIER_SERVICE') private readonly cashierService: CashierService,
		@InjectRepository(CashierAuthEntity) 
		private readonly cashierAuthRepository: Repository<CashierAuthEntity>
	) {}

	// UTILS
	async login (code: string): Promise<LoginResponseI | null> {
		const cashier: CashierEntity | null = await this.cashierService.getCashierByCode(code);

		if (cashier) {
			const access_token: string = await this.createAccessToken(cashier);
			const refresh_token: string = await this.createRefreshToken(cashier);

			return { access_token, refresh_token } as LoginResponseI;
		}

		return null;
	}

	async createAccessToken (cashier: CashierEntity): Promise<string> {
		const payload = {
			sub: cashier.id
		};

		return await this.jwtService.signAsync(payload);
	}

	async createRefreshToken (cashier: CashierEntity): Promise<string> {
		const expiresIn: number = 86400;
		const cashierAuth: CashierAuthEntity = await this.createCashierAuth(cashier, expiresIn);

		const payload = {
			sub: cashierAuth.id
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
		const cashierAuth: CashierAuthEntity = await this.cashierAuthRepository.findOne({ where: { id }, relations: { cashier: true } });

		if (cashierAuth) {
			const access_token: string = await this.createAccessToken(cashierAuth.cashier);

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

	async revokeRefreshToken (id: string): Promise<any | null> {
		const cashierAuth: CashierAuthEntity = await this.cashierAuthRepository.findOneBy({ id });

		if (cashierAuth) {
			return await this.deleteCashierAuth(id);
		}

		return null;
	}

	// CREATE
	async createCashierAuth (
		cashier: CashierEntity, expiresIn: number
	): Promise<CashierAuthEntity> 
	{
		const expired_at: Date = new Date();
		expired_at.setTime(expired_at.getTime() + expiresIn);

		const makeRefreshToken: CashierAuthEntity = await this.cashierAuthRepository.create({
			cashier,
			expired_at
		});

		return await this.cashierAuthRepository.save(makeRefreshToken);	
	}

	// READ
	async getCashierByCode (code: string): Promise<CashierEntity | null> {
		return await this.cashierService.getCashierByCode(code);
	}

	// DELETE
	async deleteCashierAuth (id: string): Promise<any> {
		return await this.cashierAuthRepository.softDelete(id);
	}
}
