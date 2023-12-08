import {
	Min,
	IsDate,
	IsNumber,
	IsOptional
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger'

export class IntervalDateDto {
	@ApiPropertyOptional({ default: new Date(), type: Number })
   @IsOptional()
   @IsDate({ message: 'Tanggal mulai tidak valid' })
   @Type(() => Date)
   from?: Date;

   @ApiPropertyOptional({ default: new Date(), type: Number })
   @IsOptional()
   @IsDate({ message: 'Tanggal akhir tidak valid' })
   @Type(() => Date)
   to?: Date;
}

export class PaginationDto {
	@ApiPropertyOptional({ default: 1 })
	@IsOptional()
	@IsNumber({}, { message: 'Halaman harus berupa angka' })
	@Min(1, { message: 'Halaman tidak boleh kurang dari $constraint1' })
	@Type(() => Number)
	page?: number;

	@ApiPropertyOptional({ default: 5 })
	@IsOptional()
	@IsNumber({}, { message: 'Batas data harus berupa angka' })
	@Min(1, { message: 'Batas data tidak boleh kurang dari $constraint1' })
	@Type(() => Number)
	limit?: number;
}