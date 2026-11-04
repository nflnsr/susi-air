import { Module } from '@nestjs/common';
import { DocumentService } from './document.service.js';
import { DocumentController } from './document.controller.js';

@Module({
  providers: [DocumentService],
  controllers: [DocumentController]
})
export class DocumentModule {}
