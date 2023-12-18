import { 
	IsEnum,
	IsString,
	MaxLength, 
	IsNotEmpty,
	IsNumberString
} from 'class-validator';
import { 
	ApiProperty,
	IntersectionType
} from '@nestjs/swagger';

import { Mode } from 'src/inventory/stock-record/entity/stock-record.entity';

export class IDDto {
	@ApiProperty({ default: 'id Unit' })
	@IsNotEmpty({ message: 'ID wajib diisi' })
	@IsString({ message: 'ID harus berupa string' })
	id: string;
}

export class StockDto {
	@ApiProperty({ default: '100' })
	@IsNotEmpty({ message: 'Stok produk wajib diisi' })
	@IsNumberString({}, { message: 'Stok produk harus berupa angka string' })
	@MaxLength(255, { message: 'Stok produk tidak boleh melebihi $constraint1 karakter' })
	stock: string;
}

export class ModeDto {
	@ApiProperty({ default: Mode.PLUS })
	@IsNotEmpty({ message: 'Mode stok produk wajib diisi' })
	@IsEnum(Mode, { message: `Mode harus bernilai '${ Mode.PLUS }' atau '${ Mode.MIN }'` })
	mode: Mode;
}

export class SetStockDto extends IntersectionType(IDDto, ModeDto, StockDto) {}