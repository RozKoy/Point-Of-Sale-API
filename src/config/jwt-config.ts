import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
	constructor (private configService: ConfigService) {}

	createJwtOptions () {
		return this.configService.get('jwt');
	}
}