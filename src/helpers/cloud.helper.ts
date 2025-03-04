import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudService {
  constructor() {
    cloudinary.config({
      cloud_name: 'di6tygnb5',
      api_key: '663462546442577',
      api_secret: 'lM_nHJvVtDIsAdS7A9XU1Rx4dec',
    });
  }

  async uploadLottieFilesToCloud(file: Express.Multer.File): Promise<string | null> {
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
