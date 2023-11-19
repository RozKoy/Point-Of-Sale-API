import { 
	MaxLength, 
	IsNotEmpty,
	IsOptional
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

export class SearchDto {
	@ApiPropertyOptional({ default: 'search' })
	@IsOptional()
	search: string;
}

export class AllDto extends IntersectionType(
	IDDto, 
	ImageDto, 
	SearchDto,
	UsernameDto 
) {}

export class CreateCashierDto extends OmitType(AllDto, ['id', 'search'] as const) {}

export class UpdateCashierDto extends PartialType(OmitType(AllDto, ['search'] as const)) {}