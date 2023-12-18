import {
	Min,
	IsArray,
	IsNumber,
	IsString,
	MinLength,
	MaxLength,
	IsNotEmpty,
	IsOptional,
	ArrayNotEmpty,
	ValidateNested,
	IsNumberString
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { 
	ApiProperty, 
	IntersectionType,
	ApiPropertyOptional 
} from '@nestjs/swagger';

export class IDDto {
	@ApiProperty({ default: 'id' })
	@IsNotEmpty({ message: 'ID wajib diisi' })
	@IsString({ message: 'ID harus berupa string' })
	id: string;
}

export class InfoDto {
	@ApiProperty({ default: '123456' })
	@IsNotEmpty({ message: 'Kode kasir wajib diisi' })
	@IsString({ message: 'Kode kasir harus berupa string' })
	@MinLength(6, { message: 'Kode kasir tidak boleh kurang dari $constraint1 Karakter' })
	@MaxLength(6, { message: 'Kode kasir tidak boleh melebihi $constraint1 karakter' })
	code: string;

	@ApiProperty({ default: 'Keterangan' })
	@IsNotEmpty({ message: 'Keterangan wajib diisi' })
	@IsString({ message: 'Keterangan harus berupa string' })
	@MaxLength(255, { message: 'Keterangan tidak boleh melebihi $constraint1 karakter' })
	message: string;
}

export class SearchDto {
	@ApiPropertyOptional({ default: 'Search' })
	@IsOptional()
	@IsString({ message: 'Pencarian harus berupa string' })
	@MaxLength(255, { message: 'Pencarian tidak boleh melebihi $constraint1 karakter' })
	@Transform(({ value }) => value.toLowerCase())
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

export class ItemDto {
	@ApiProperty({ default: 'id unit' })
	@IsNotEmpty({ message: 'Id unit wajib diisi' })
	@IsString({ message: 'Id unit harus berupa string' })
	unit: string;

	@ApiProperty({ default: '5' })
	@IsString({ message: 'Banyak produk harus berupa string' })
	@IsNumberString({}, { message: 'Banyak produk harus berupa angka string' })
	@MaxLength(255, { message: 'Banyak produk tidak boleh melebihi $constraint1 karakter' })
	quantity: string;
}

export class CreateInvoiceDto {
	@ApiPropertyOptional({ default: '0' })
	@IsOptional()
	@IsString({ message: 'Potongan harga harus berupa string' })
	@IsNumberString({}, { message: 'Potongan harga harus berupa angka string' })
	@MaxLength(255, { message: 'Potongan harga tidak boleh melebihi $constraint1 karakter' })
	discount: string;

	@ApiProperty({ type: [ItemDto] })
	@IsNotEmpty({ message: 'Daftar produk wajib diisi' })
	@IsArray({ message: 'Daftar produk harus berupa array' })
	@ArrayNotEmpty({ message: 'Daftar produk tidak boleh kosong' })
	@ValidateNested({ each: true })
	@Type(() => ItemDto)
	items: ItemDto[];
}

export class DeleteRequestDto extends IntersectionType(IDDto, InfoDto) {}