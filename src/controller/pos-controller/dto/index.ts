import {
	Min,
	IsNumber,
	IsString,
   MinLength,
	MaxLength,
	IsNotEmpty,
	IsOptional
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

export class DeleteRequestDto extends IntersectionType(IDDto, InfoDto) {}