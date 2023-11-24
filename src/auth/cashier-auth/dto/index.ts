import { 
	IsString,
	MinLength, 
	MaxLength, 
	IsNotEmpty
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CodeDto {
	@ApiProperty({ default: '123456' })
	@IsNotEmpty({ message: 'Kode kasir wajib diisi' })
	@IsString({ message: 'Kode kasir harus berupa string' })
	@MinLength(6, { message: 'Kode kasir tidak boleh kurang dari $constraint1 Karakter' })
	@MaxLength(6, { message: 'Kode kasir tidak boleh melebihi $constraint1 karakter' })
	code: string;
}

export class RefreshAccessTokenDto {
	@ApiProperty()
	@IsNotEmpty({ message: 'Refresh token wajib diisi' })
	@IsString({ message: 'Refresh token harus berupa string' })
	refresh_token: string;
}