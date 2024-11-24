import { Injectable } from '@nestjs/common';
import { DBService } from 'src/db/db.service';

@Injectable()
export class OrdersService {
  constructor(private db: DBService) {}

  getAll() {
    return this.db.order.findMany();
  }
}
