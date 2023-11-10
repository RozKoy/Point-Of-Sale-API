import { 
	IsEmail, 
	MinLength, 
	MaxLength, 
	IsNotEmpty
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
	@ApiProperty()
	@IsNotEmpty({ message: 'Alamat email wajib diisi' })
	@IsEmail({}, { message: 'Alamat email tidak sesuai' })
	@MaxLength(255, { message: 'Alamat email tidak boleh melebihi $constraint1 karakter' })
	email: string;

	@ApiProperty()
	@IsNotEmpty({ message: 'Kata sandi wajib diisi' })
	@MinLength(6, { message: 'Kata sandi tidak boleh kurang dari $constraint1 Karakter' })
	password: string;
}

export class RefreshAccessTokenDto {
	@ApiProperty()
	@IsNotEmpty({ message: 'Refresh token wajib diisi' })
	refresh_token: string;
}