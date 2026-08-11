import { Injectable } from '@nestjs/common';
import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { s3Client } from '../config/s3.config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class DocumentService {
  async uploadFileToS3(file: Express.Multer.File): Promise<string> {
    console.log('AWS Runtime Config:', {
      region: process.env.AWS_REGION,
      bucket: process.env.AWS_BUCKET_NAME,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKeyExists: !!process.env.AWS_SECRET_ACCESS_KEY,
    });
    const key = `uploads/${randomUUID()}-${file.originalname}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command);
    console.log(`File uploaded to S3 with key: ${key}`);
    return key; // URL valid for 1 hour
  }

  async generateDocumentViewUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      ResponseContentDisposition: 'inline', // This will prompt the browser to display the file inline
    });
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL valid for 1 hour
  }

  async deleteFileFromS3(fileId: string): Promise<void> {
    console.log(`Deleting file from S3 with key: ${fileId}`);
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileId, // Assuming fileId is the S3 key
      }),
    );
  }
}
