import { Injectable } from '@nestjs/common';
import { DBService } from 'src/db/db.service';
import { CreateProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(private db: DBService) {}

  getAll() {
    return this.db.product.findMany();
  }

  getById(id: number) {
    return this.db.product.findUnique({ where: { id } });
  }

  create(createProductDto: CreateProductDto) {
    return this.db.product.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
        stock: createProductDto.stock,
      },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.db.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  delete(id: number) {
    return this.db.product.delete({ where: { id } });
  }
}
