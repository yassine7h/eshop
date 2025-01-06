import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
  } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get(':productId')
  findAll(@Param('productId') productId: string) {
    return this.reviewsService.findByProductId(+productId); // Assuming you fetch by productId and it's numeric
  }

  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    console.log(createReviewDto);
    return this.reviewsService.create(createReviewDto);
  }

}