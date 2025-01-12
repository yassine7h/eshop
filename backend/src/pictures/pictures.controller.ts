import { Controller, Get, Param, Res } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthRoles } from 'src/auth/roles.guard';
import { PicturesService } from './pictures.service';

@Controller('pictures')
export class PicturesController {
  constructor(private pictureService: PicturesService) {}
  //   @AuthRoles(Role.ADMIN, Role.SELLER, Role.CLIENT)
  @Get('*')
  async get(@Param() params: Record<string, string>, @Res() res) {
    const filename = params['0'];
    const fileContent = await this.pictureService.get(filename);
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(fileContent);
  }
}