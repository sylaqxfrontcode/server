import {
  Controller,
  Post,
  Delete,
  UploadedFile,
  Query,
  UseInterceptors,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('A file is required');
    }
    console.log('Received file for upload:', file);
    const fileUrl = await this.documentService.uploadFileToS3(file);
    console.log('File uploaded to S3 with URL:', fileUrl, {
      key: fileUrl,
    });
    return {
      key: fileUrl,
    };
  }

  @Post('view')
  async generateDocumentViewUrl(@Query('key') key: string) {
    const viewUrl = await this.documentService.generateDocumentViewUrl(key);
    return {
      key: viewUrl,
    };
  }

  @Delete('delete')
  async deleteDocument(@Query('fileId') fileId: string) {
    console.log('Received request to delete file with ID:', fileId);
    await this.documentService.deleteFileFromS3(fileId);
    return { message: 'File deleted successfully' };
  }
}
