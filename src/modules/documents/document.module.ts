import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';

@Module({
  imports: [AuthModule],
  providers: [DocumentService],
  controllers: [DocumentController],
  exports: [DocumentService],
})
export class DocumentModule {}
