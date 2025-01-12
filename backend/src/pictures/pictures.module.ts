import { Global, Module } from '@nestjs/common';
import { PicturesController } from './pictures.controller';
import { PicturesService } from './pictures.service';

@Global()
@Module({
  controllers: [PicturesController],
  providers: [PicturesService],
  exports: [PicturesService],
})
export class PicturesModule {}