import { 
	MaxLength, 
	IsNotEmpty,
	IsOptional
} from 'class-validator';

export class CreateCashierDto {
	@IsNotEmpty({ message: 'Nama pengguna wajib diisi' })
	@MaxLength(255, { message: 'Nama pengguna tidak boleh melebihi $constraint1 karakter' })
	username: string;

	@IsNotEmpty({ message: 'Gambar wajib diisi' })
	image: string;
}

export class UpdateCashierDto {
	@IsOptional()
	@MaxLength(255, { message: 'Nama pengguna tidak boleh melebihi $constraint1 karakter' })
	username?: string;

	@IsOptional()
	image?: string;
}