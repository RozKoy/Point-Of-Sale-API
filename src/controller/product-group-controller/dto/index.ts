import { 
   Min,
   IsDate,
   MinDate,
   IsArray,
   IsNumber,
   IsString,
   MaxLength, 
   IsNotEmpty,
   IsOptional,
   ArrayNotEmpty,
   IsNumberString,
   ValidateNested
} from 'class-validator';
import { 
   ApiProperty,
   IntersectionType, 
   ApiPropertyOptional 
} from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

export class GroupDto {
   @ApiProperty({ default: 'Unit' })
   @IsNotEmpty({ message: 'Unit produk wajib diisi' })
   @IsString({ message: 'Unit produk harus berupa string' })
   unit: string;

   @ApiProperty({ default: '100' })
   @IsNotEmpty({ message: 'Stok produk wajib diisi' })
   @IsNumberString({}, { message: 'Stok produk harus berupa angka string' })
   @MaxLength(255, { message: 'Stok produk tidak boleh melebihi $constraint1 karakter' })
   stock: string;

   @ApiProperty({ default: '50000' })
   @IsNotEmpty({ message: 'Harga produk wajib diisi' })
   @IsNumberString({}, { message: 'Harga produk harus berupa angka string' })
   @MaxLength(255, { message: 'Harga produk tidak boleh melebihi $constraint1 karakter' })
   prize: string;
}

export class ProductDto {
   @ApiProperty({ default: 'Produk' })
   @IsNotEmpty({ message: 'Nama produk wajib diisi' })
   @IsString({ message: 'Nama produk harus berupa string' })
   @MaxLength(255, { message: 'Nama produk tidak boleh melebihi $constraint1 karakter' })
   @Transform(({ value }) => (typeof(value) === 'string')? value.toLowerCase() : value)
   name: string;

   @ApiPropertyOptional({ default: ['id'] })
   @IsOptional()
   @IsArray({ message: 'Daftar kategori harus berupa array' })
   @Transform(
      ({ value }) => {
         if (typeof(value) === 'object') {
            if (value?.length > 0) {
               for (let x of value) {
                  if (typeof(x) !== 'string') {
                     return 'none';
                  }
               }
            }
         }

         return value;
      }
   )
   categories?: string[];

   @ApiPropertyOptional({ default: new Date(), type: Number })
   @IsOptional()
   @IsDate({ message: 'Tanggal kadaluarsa tidak valid' })
   @MinDate(() => new Date(), { message: 'Tanggal kadaluarsa tidak boleh kurang dari waktu saat ini' })
   @Type(() => Date)
   expired_at?: Date;

   @ApiProperty({ default: 'Gambar' })
   @IsNotEmpty({ message: 'Gambar produk wajib diisi' })
   @IsString({ message: 'Gambar produk harus berupa string' })
   image: string;

   @ApiProperty({ type: [GroupDto] })
   @IsNotEmpty({ message: 'Daftar grup produk wajib diisi' })
   @IsArray({ message: 'Daftar grup produk harus berupa array' })
   @ArrayNotEmpty({ message: 'Daftar grup produk tidak boleh kosong' })
   @ValidateNested({ each: true })
   @Type(() => GroupDto)
   group: GroupDto[];
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

export class FilterDto extends IntersectionType(SearchDto, PaginationDto) {}