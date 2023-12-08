import {
	MaxLength,
	IsNotEmpty,
	IsNumberString
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetCashOnHandDto {
	@ApiProperty({ default: '5000000' })
   @IsNotEmpty({ message: 'Uang ditangan wajib diisi' })
   @IsNumberString({}, { message: 'Uang ditangan harus berupa angka string' })
   @MaxLength(255, { message: 'Uang ditangan tidak boleh melebihi $constraint1 karakter' })
	cash_on_hand: string;
}