import { 
	IsEmail, 
	MinLength, 
	MaxLength, 
	IsNotEmpty,
	IsOptional
} from 'class-validator';

export class CreateAdminDto {
	@IsNotEmpty({ message: 'Alamat email wajib diisi' })
	@IsEmail({}, { message: 'Alamat email tidak sesuai' })
	@MaxLength(255, { message: 'Alamat email tidak boleh melebihi $constraint1 karakter' })
	email: string;

	@IsNotEmpty({ message: 'Nama pengguna wajib diisi' })
	@MaxLength(255, { message: 'Nama pengguna tidak boleh melebihi $constraint1 karakter' })
	username: string;

	@IsNotEmpty({ message: 'Kata sandi wajib diisi' })
	@MinLength(6, { message: 'Kata sandi tidak boleh kurang dari $constraint1 Karakter' })
	password: string;

	@IsNotEmpty({ message: 'Gambar wajib diisi' })
	image: string;
}

export class UpdateAdminDto {
	@IsOptional()
	@IsEmail({}, { message: 'Alamat email tidak sesuai' })
	@MaxLength(255, { message: 'Alamat email tidak boleh melebihi $constraint1 karakter' })
	email?: string;

	@IsOptional()
	@MaxLength(255, { message: 'Nama pengguna tidak boleh melebihi $constraint1 karakter' })
	username?: string;

	@IsOptional()
	@MinLength(6, { message: 'Kata sandi tidak boleh kurang dari $constraint1 Karakter' })
	password?: string;

	@IsOptional()
	image?: string;
}