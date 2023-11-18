import { 
	MinLength, 
	MaxLength, 
	IsNotEmpty
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CodeDto {
	@ApiProperty({ default: '123456' })
	@IsNotEmpty({ message: 'Kode kasir wajib diisi' })
	@MinLength(6, { message: 'Kode kasir tidak boleh kurang dari $constraint1 Karakter' })
	@MaxLength(6, { message: 'Kode kasir tidak boleh melebihi $constraint1 karakter' })
	code: string;
}

export class RefreshAccessTokenDto {
	@ApiProperty()
	@IsNotEmpty({ message: 'Refresh token wajib diisi' })
	refresh_token: string;
}