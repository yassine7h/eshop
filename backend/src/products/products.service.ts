import { Injectable } from '@nestjs/common';
import { DBService } from 'src/db/db.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PicturesService } from 'src/pictures/pictures.service';

@Injectable()
export class ProductsService {
  constructor(
    private db: DBService,
    private picturesService: PicturesService,
  ) {}

  getAll() {
    return this.db.product.findMany();
  }

  getById(id: number) {
    return this.db.product.findUnique({ where: { id } });
  }

  async create(createProductDto: CreateProductDto) {
    const pictureUrl = await this.picturesService.save(
      `${createProductDto.name}_${Date.now()}`,
      createProductDto.picture,
    );
    return this.db.product.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
        stock: createProductDto.stock,
        picture: pictureUrl,
      },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    if (updateProductDto.picture) {
      const pictureUrl = await this.picturesService.save(
        `${updateProductDto.name}_${Date.now()}`,
        updateProductDto.picture,
      );
      updateProductDto.picture = pictureUrl;
    }
    return this.db.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  delete(id: number) {
    return this.db.product.delete({ where: { id } });
  }

  getReviews(productId: number) {
    return this.db.review.findMany({
      where: { productId },
      include: {
        user: { select: { firstname: true, lastname: true, email: true } },
      },
    });
  }
}
