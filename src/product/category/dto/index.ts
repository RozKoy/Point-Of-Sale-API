import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class NameDto {
	@ApiProperty()
	@IsNotEmpty({ message: 'Kategori wajib diisi' })
	@MaxLength(255, { message: 'Kategori tidak boleh melebihi $constraint1 karakter' })
	name: string;
}