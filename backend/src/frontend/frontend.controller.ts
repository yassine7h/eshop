import { Controller, Get, Res } from '@nestjs/common';
import { join } from 'path';
import { Response } from 'express';

@Controller('frontend')
export class FrontendController {
  @Get('*')
  async serveFrontend(@Res() res: Response) {
    const distPath = join(__dirname, '../dist');
    const indexPath = join(distPath, 'index.html');

    res.sendFile(indexPath, (err) => {
      if (err) {
        console.log(err);
        console.log(__dirname);
        res.status(500).send('An error occurred while serving the frontend.');
      }
    });
  }
}
