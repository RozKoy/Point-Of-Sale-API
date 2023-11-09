import { 
	IsEmail, 
	MinLength, 
	MaxLength, 
	IsNotEmpty,
	IsOptional
} from 'class-validator';
import { 
	ApiProperty, 
	ApiPropertyOptional 
} from '@nestjs/swagger';

export class CreateAdminDto {
	@ApiProperty()
	@IsNotEmpty({ message: 'Alamat email wajib diisi' })
	@IsEmail({}, { message: 'Alamat email tidak sesuai' })
	@MaxLength(255, { message: 'Alamat email tidak boleh melebihi $constraint1 karakter' })
	email: string;

	@ApiProperty()
	@IsNotEmpty({ message: 'Nama pengguna wajib diisi' })
	@MaxLength(255, { message: 'Nama pengguna tidak boleh melebihi $constraint1 karakter' })
	username: string;

	@ApiProperty()
	@IsNotEmpty({ message: 'Kata sandi wajib diisi' })
	@MinLength(6, { message: 'Kata sandi tidak boleh kurang dari $constraint1 Karakter' })
	password: string;

	@ApiProperty()
	@IsNotEmpty({ message: 'Gambar wajib diisi' })
	image: string;
}

export class UpdateAdminDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsEmail({}, { message: 'Alamat email tidak sesuai' })
	@MaxLength(255, { message: 'Alamat email tidak boleh melebihi $constraint1 karakter' })
	email?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@MaxLength(255, { message: 'Nama pengguna tidak boleh melebihi $constraint1 karakter' })
	username?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@MinLength(6, { message: 'Kata sandi tidak boleh kurang dari $constraint1 Karakter' })
	password?: string;

	@ApiPropertyOptional()
	@IsOptional()
	image?: string;
}