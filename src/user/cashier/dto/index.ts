import { 
	MaxLength, 
	IsNotEmpty,
} from 'class-validator';
import { 
	PartialType,
	ApiProperty,
	IntersectionType
} from '@nestjs/swagger';

export class UsernameDto {
	@ApiProperty({ default: 'username' })
	@IsNotEmpty({ message: 'Nama pengguna wajib diisi' })
	@MaxLength(255, { message: 'Nama pengguna tidak boleh melebihi $constraint1 karakter' })
	username: string;
}

export class ImageDto {
	@ApiProperty({ default: 'image' })
	@IsNotEmpty({ message: 'Gambar wajib diisi' })
	image: string;
}

export class CreateCashierDto extends IntersectionType(UsernameDto, ImageDto) {}

export class UpdateCashierDto extends PartialType(CreateCashierDto) {}