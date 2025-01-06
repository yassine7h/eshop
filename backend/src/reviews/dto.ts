import { IsNumber, IsString } from 'class-validator';
export class CreateReviewDto {
    @IsNumber()
    productId: number;
    @IsNumber()
    userId: number;
    @IsString()
    reviewText: string;
    @IsNumber()
    rating: number;
  }
  