import { IsNumber, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  name?: string;
  @IsNumber()
  price?: number;
  @IsNumber()
  stock?: number;
}
export class CreateProductDto {
  @IsString()
  name: string;
  @IsNumber()
  price: number;
  @IsNumber()
  stock: number;
}
