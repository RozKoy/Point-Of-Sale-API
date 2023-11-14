import { IsNotEmpty, MaxLength } from 'class-validator';

import { 
	ApiProperty,
	PartialType,
	IntersectionType 
} from '@nestjs/swagger';

export class NameDto {
	@ApiProperty()
	@IsNotEmpty({ message: 'Nama produk wajib diisi' })
	@MaxLength(255, { message: 'Nama produk tidak boleh melebihi $constraint1 karakter' })
	name: string;
}

export class ImageDto {
	@ApiProperty()
	@IsNotEmpty({ message: 'Gambar wajib diisi' })
	image: string;
}

export class CreateProductDto extends IntersectionType(NameDto, ImageDto) {}

export class UpdateProductDto extends PartialType(CreateProductDto) {}