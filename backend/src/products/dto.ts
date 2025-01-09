import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;
  @IsNumber()
  @IsOptional()
  price?: number;
  @IsNumber()
  @IsOptional()
  stock?: number;
  @IsString()
  @IsOptional()
  picture?;
}
export class CreateProductDto {
  @IsString()
  name: string;
  @IsNumber()
  price: number;
  @IsNumber()
  stock: number;
  @IsString()
  picture;
}
