import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';

@Injectable()
export class CloudService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('cloud.cloud_name'),
      api_key: this.configService.get<string>('cloud.api_key'),
      api_secret: this.configService.get<string>('cloud.api_secret'),
    });
  }

  async uploadLottieFilesToCloud(
    file: Express.Multer.File,
  ): Promise<string | null> {
    try {
      const id = uuidv4();

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { public_id: id, resource_type: 'raw' },
          (error, result: UploadApiResponse) => {
            if (error) {
              console.error('Lỗi upload:', error);
              reject(null);
            } else {
              const optimizeUrl = cloudinary.url(id, {
                fetch_format: 'auto',
                quality: 'auto',
                resource_type: 'raw',
              });
              resolve(optimizeUrl);
            }
          },
        );

        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
      });
    } catch (error) {
      console.error('Lỗi upload:', error);
      return null;
    }
  }

  async uploadFilesToCloud(
    file: Express.Multer.File,
  ): Promise<string | null> {
    try {
      const id = uuidv4();

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { public_id: id },
          (error, result: UploadApiResponse) => {
            if (error) {
              console.error('Lỗi upload:', error);
              reject(null);
            } else {
              const optimizeUrl = cloudinary.url(id, {
                fetch_format: 'auto',
                quality: 'auto'
              });
              console.log(optimizeUrl);
              resolve(optimizeUrl);
            }
          },
        );

        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
      });
    } catch (error) {
      console.error('Lỗi upload:', error);
      return null;
    }
  }
}
