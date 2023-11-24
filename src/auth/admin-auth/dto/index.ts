import { 
	IsEmail, 
	IsString,
	MinLength, 
	MaxLength, 
	IsNotEmpty
} from 'class-validator';
import { 
	PickType,
	OmitType,
	ApiProperty, 
	IntersectionType 
} from '@nestjs/swagger';

export class EmailDto {
	@ApiProperty({ default: 'email@gmail.com' })
	@IsNotEmpty({ message: 'Alamat email wajib diisi' })
	@IsString({ message: 'Alamat email harus berupa string' })
	@IsEmail({}, { message: 'Alamat email tidak sesuai' })
	@MaxLength(255, { message: 'Alamat email tidak boleh melebihi $constraint1 karakter' })
	email: string;
}

export class PasswordDto {
	@ApiProperty({ default: 'password' })
	@IsNotEmpty({ message: 'Kata sandi wajib diisi' })
	@IsString({ message: 'Kata sandi harus berupa string' })
	@MinLength(6, { message: 'Kata sandi tidak boleh kurang dari $constraint1 Karakter' })
	password: string;	
}

export class PasswordConfirmationDto {
	@ApiProperty({ default: 'password' })
	@IsNotEmpty({ message: 'Konfirmasi kata sandi wajib diisi' })
	@IsString({ message: 'Konfirmasi kata sandi harus berupa string' })
	@MinLength(6, { message: 'Konfirmasi kata sandi tidak boleh kurang dari $constraint1 Karakter' })
	password_confirmation: string;	
}

export class OtpDto {
	@ApiProperty({ default: '123456' })
	@IsNotEmpty({ message: 'Kode otp wajib diisi' })
	@IsString({ message: 'Kode otp harus berupa string' })
	@MinLength(6, { message: 'Kode otp tidak boleh kurang dari $constraint1 Karakter' })
	@MaxLength(6, { message: 'Kode otp tidak boleh melebihi $constraint1 karakter' })
	otp: string;	
}

export class RefreshAccessTokenDto {
	@ApiProperty()
	@IsNotEmpty({ message: 'Refresh token wajib diisi' })
	@IsString({ message: 'Refresh token harus berupa string' })
	refresh_token: string;
}

export class AllDto extends IntersectionType(
	OtpDto, 
	EmailDto, 
	PasswordDto, 
	RefreshAccessTokenDto,
	PasswordConfirmationDto 
) {}

export class LoginDto extends PickType(AllDto, ['email', 'password'] as const) {}

export class OtpVerificationDto extends PickType(AllDto, ['email', 'otp'] as const) {}

export class NewPasswordDto extends OmitType(AllDto, ['refresh_token'] as const) {}