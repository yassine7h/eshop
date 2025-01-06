import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto';
import { DBService } from 'src/db/db.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly db: DBService) {}

  create(createReviewDto: CreateReviewDto) {
    console.log(createReviewDto);
    return this.db.review.create({
      data: {
        productId: createReviewDto.productId,
        userId: createReviewDto.userId,
        reviewText: createReviewDto.reviewText,
        rating: createReviewDto.rating,
      },
    });
  }

  findByProductId(productId: number) {
    return this.db.review.findMany({
      where: { productId },
    });
  }
}

