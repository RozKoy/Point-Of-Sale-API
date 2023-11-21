import { 
	MaxLength, 
	IsNotEmpty,
	IsOptional 
} from 'class-validator';
import { 
	ApiProperty, 
	ApiPropertyOptional, 
	IntersectionType 
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class IDDto {
	@ApiProperty({ default: 'id' })
	@IsNotEmpty({ message: 'ID wajib diisi' })
	id: string;
}

export class CategoryNameDto {
	@ApiProperty({ default: 'Kategori' })
	@IsNotEmpty({ message: 'Kategori wajib diisi' })
	@MaxLength(255, { message: 'Kategori tidak boleh melebihi $constraint1 karakter' })
	@Transform(({ value }) => value.toLowerCase())
	name: string;
}

export class CategorySearchDto {
	@ApiPropertyOptional({ default: 'Kategori' })
	@IsOptional()
	@MaxLength(255, { message: 'Pencarian tidak boleh melebihi $constraint1 karakter' })
	@Transform(({ value }) => value.toLowerCase())
	search: string;
}

export class CategoryUpdateDto extends IntersectionType(IDDto, CategoryNameDto) {}