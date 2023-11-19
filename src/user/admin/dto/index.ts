import { 
	IsEmail, 
	MinLength, 
	MaxLength,
	IsOptional, 
	IsNotEmpty
} from 'class-validator';
import { 
	OmitType,
	PartialType,
	ApiProperty,
	IntersectionType,
	ApiPropertyOptional
} from '@nestjs/swagger';

export class IDDto {
	@ApiProperty({ default: 'id' })
	@IsNotEmpty({ message: 'ID wajib diisi' })
	id: string;
}

export class EmailDto {
	@ApiProperty({ default: 'email@gmail.com' })
	@IsNotEmpty({ message: 'Alamat email wajib diisi' })
	@IsEmail({}, { message: 'Alamat email tidak sesuai' })
	@MaxLength(255, { message: 'Alamat email tidak boleh melebihi $constraint1 karakter' })
	email: string;
}

export class UsernameDto {
	@ApiProperty({ default: 'username' })
	@IsNotEmpty({ message: 'Nama pengguna wajib diisi' })
	@MaxLength(255, { message: 'Nama pengguna tidak boleh melebihi $constraint1 karakter' })
	username: string;
}

export class PasswordDto {
	@ApiProperty({ default: 'password' })
	@IsNotEmpty({ message: 'Kata sandi wajib diisi' })
	@MinLength(6, { message: 'Kata sandi tidak boleh kurang dari $constraint1 Karakter' })
	password: string;
}

export class ImageDto {
	@ApiProperty({ default: 'image' })
	@IsNotEmpty({ message: 'Gambar wajib diisi' })
	image: string;
}

export class SearchDto {
	@ApiPropertyOptional({ default: 'search' })
	@IsOptional()
	search: string;
}

export class AllDto extends IntersectionType(
	IDDto, 
	EmailDto, 
	ImageDto, 
	SearchDto,
	UsernameDto, 
	PasswordDto 
) {}

export class CreateAdminDto extends OmitType(AllDto, ['id', 'search'] as const) {}

export class UpdateAdminDto extends PartialType(OmitType(AllDto, ['search'] as const)) {}