import { 
	MaxLength, 
	IsNotEmpty,
	IsOptional
} from 'class-validator';
import { 
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

export class AllDto extends IntersectionType(IDDto, UsernameDto, ImageDto) {}

export class CreateCashierDto extends IntersectionType(UsernameDto, ImageDto) {}

export class UpdateCashierDto extends PartialType(AllDto) {}

export class SearchDto {
	@ApiPropertyOptional({ default: 'search' })
	@IsOptional()
	search: string;
}