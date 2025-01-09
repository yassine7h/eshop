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
      // Ensure the directory exists
      if (!fs.existsSync(this.path)) {
        fs.mkdirSync(this.path, { recursive: true });
      }
      // Remove the Base64 metadata (if present)
      const base64Content = base64Data.split(';base64,').pop();
      if (!base64Content) {
        throw new BadRequestException('Invalid Base64 string');
      }
      // Extract the MIME type and determine the extension
      const mimeType = base64Data.split(';')[0].split(':')[1];
      const extension = mimeType.split('/')[1]; // Extracts 'jpeg', 'png', etc.
      // Check if MIME type is an image
      if (!mimeType.startsWith('image/')) {
        throw new BadRequestException('The provided file is not an image');
      }
      if (!extension) {
        throw new BadRequestException(
          'Unable to determine file extension from Base64 string',
        );
      }
      // Add the extension to the filename
      const fileWithExtension = `${filename}.${extension}`;
      // Decode the Base64 content
      const buffer = Buffer.from(base64Content, 'base64');
      // Define the target path for the file
      const targetPath = path.join(this.path, fileWithExtension);
      // Write the decoded buffer to the file
      await fs.promises.writeFile(targetPath, buffer);
      return fileWithExtension; // Return the path of the saved file
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
