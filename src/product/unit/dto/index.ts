import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class NameDto {
	@ApiProperty()
	@IsNotEmpty({ message: 'Unit wajib diisi' })
	@MaxLength(255, { message: 'Unit tidak boleh melebihi $constraint1 karakter' })
	name: string;
}