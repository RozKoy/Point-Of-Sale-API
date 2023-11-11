import { 
	MaxLength, 
	IsNotEmpty,
	IsOptional
} from 'class-validator';
import { 
	PartialType,
	ApiProperty,
	ApiPropertyOptional 
} from '@nestjs/swagger';

export class CreateCashierDto {
	@ApiProperty()
	@IsNotEmpty({ message: 'Nama pengguna wajib diisi' })
	@MaxLength(255, { message: 'Nama pengguna tidak boleh melebihi $constraint1 karakter' })
	username: string;

	@ApiProperty()
	@IsNotEmpty({ message: 'Gambar wajib diisi' })
	image: string;
}

export class UpdateCashierDto extends PartialType(CreateCashierDto) {}