import { 
	Min,
	IsNumber,
	IsString,
	MaxLength, 
	IsNotEmpty,
	IsOptional
} from 'class-validator';
import { 
	PickType,
	PartialType,
	ApiProperty,
	IntersectionType,
	ApiPropertyOptional
} from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class IDDto {
	@ApiProperty({ default: 'id' })
	@IsNotEmpty({ message: 'ID wajib diisi' })
	@IsString({ message: 'ID harus berupa string' })
	id: string;
}

export class UsernameDto {
	@ApiProperty({ default: 'username' })
	@IsNotEmpty({ message: 'Nama pengguna wajib diisi' })
	@IsString({ message: 'Nama pengguna harus berupa string' })
	@MaxLength(255, { message: 'Nama pengguna tidak boleh melebihi $constraint1 karakter' })
	username: string;
}

export class ImageDto {
	@ApiProperty({ default: 'image' })
	@IsNotEmpty({ message: 'Gambar wajib diisi' })
	@IsString({ message: 'Gambar harus berupa string' })
	image: string;
}

export class SearchDto {
	@ApiPropertyOptional({ default: 'search' })
	@IsOptional()
	@IsString({ message: 'Pencarian harus berupa string' })
	search: string;
}

export class PaginationDto {
	@ApiPropertyOptional({ default: 1 })
	@IsOptional()
	@IsNumber({}, { message: 'Halaman harus berupa angka' })
	@Min(1, { message: 'Halaman tidak boleh kurang dari $constraint1' })
	@Type(() => Number)
	page: number;

	@ApiPropertyOptional({ default: 5 })
	@IsOptional()
	@IsNumber({}, { message: 'Batas data harus berupa angka' })
	@Min(1, { message: 'Batas data tidak boleh kurang dari $constraint1' })
	@Type(() => Number)
	limit: number;
}

export class AllDto extends IntersectionType(
	IDDto, 
	ImageDto, 
	SearchDto,
	UsernameDto,
	PaginationDto
) {}

export class CreateCashierDto extends PickType(AllDto, [
	'image', 
	'username'
] as const) {}

export class UpdateCashierDto extends PartialType(PickType(AllDto, [
	'id', 
	'image', 
	'username'
] as const)) {}

export class FilterDto extends PickType(AllDto, [
	'page',
	'limit',
	'search'
] as const) {}