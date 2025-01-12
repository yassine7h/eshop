import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import * as fs from 'fs';
  import * as path from 'path';
  
  @Injectable()
  export class PicturesService {
    private path;
    constructor(private config: ConfigService) {
      this.path = this.config.get('PIC_PATH');
    }
    async save(filename: string, base64Data: string) {
      try {
        if (!fs.existsSync(this.path)) {
          fs.mkdirSync(this.path, { recursive: true });
        }
        const base64Content = base64Data.split(';base64,').pop();
        if (!base64Content) {
          throw new BadRequestException('Invalid Base64 string');
        }
        const mimeType = base64Data.split(';')[0].split(':')[1];
        const extension = mimeType.split('/')[1]; // Extracts 'jpeg', 'png', etc.
        if (!mimeType.startsWith('image/')) {
          throw new BadRequestException('The provided file is not an image');
        }
        if (!extension) {
          throw new BadRequestException(
            'Unable to determine file extension from Base64 string',
          );
        }
        const fileWithExtension = `${filename}.${extension}`;
        const buffer = Buffer.from(base64Content, 'base64');
        const targetPath = path.join(this.path, fileWithExtension);
        await fs.promises.writeFile(targetPath, buffer);
        return fileWithExtension;
      } catch (error) {
        console.error('Error saving file:', error.message);
        throw new InternalServerErrorException('Unable to save file');
      }
    }
    async get(filename: string) {
      try {
        const filePath = path.join(this.path, filename);
        if (!fs.existsSync(filePath)) {
          throw new BadRequestException('File not found: ' + filePath);
        }
        const fileContent = await fs.promises.readFile(filePath);
        return fileContent;
      } catch (error) {
        throw new BadRequestException('Error retrieving file: ' + error.message);
      }
    }
  }