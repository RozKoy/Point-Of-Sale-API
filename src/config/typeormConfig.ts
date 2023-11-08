import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
	constructor (private configService: ConfigService) {}

	createTypeOrmOptions () {
		return this.configService.get('database');
	}
}