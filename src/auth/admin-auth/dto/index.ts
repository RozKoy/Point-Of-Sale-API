import { 
	IsEmail, 
	MinLength, 
	MaxLength, 
	IsNotEmpty
} from 'class-validator';
import { 
	ApiProperty, 
	IntersectionType 
} from '@nestjs/swagger';

export class EmailDto {
	@ApiProperty()
	@IsNotEmpty({ message: 'Alamat email wajib diisi' })
	@IsEmail({}, { message: 'Alamat email tidak sesuai' })
	@MaxLength(255, { message: 'Alamat email tidak boleh melebihi $constraint1 karakter' })
	email: string;
}

export class PasswordDto {
	@ApiProperty()
	@IsNotEmpty({ message: 'Kata sandi wajib diisi' })
	@MinLength(6, { message: 'Kata sandi tidak boleh kurang dari $constraint1 Karakter' })
	password: string;	
}

export class PasswordConfirmationDto {
	@ApiProperty()
	@IsNotEmpty({ message: 'Konfirmasi kata sandi wajib diisi' })
	@MinLength(6, { message: 'Konfirmasi kata sandi tidak boleh kurang dari $constraint1 Karakter' })
	password_confirmation: string;	
}

export class OtpDto {
	@ApiProperty()
	@IsNotEmpty({ message: 'Kode otp wajib diisi' })
	@MinLength(6, { message: 'Kode otp tidak boleh kurang dari $constraint1 Karakter' })
	@MaxLength(6, { message: 'Kode otp tidak boleh melebihi $constraint1 karakter' })
	otp: string;	
}

export class LoginDto extends IntersectionType(EmailDto, PasswordDto) {}

export class OtpVerificationDto extends IntersectionType(EmailDto, OtpDto) {}

export class NewPasswordDto extends IntersectionType(EmailDto, PasswordDto, PasswordConfirmationDto, OtpDto) {}

export class RefreshAccessTokenDto {
	@ApiProperty()
	@IsNotEmpty({ message: 'Refresh token wajib diisi' })
	refresh_token: string;
}
