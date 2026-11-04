import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard.js';
import { DocumentService } from './document.service.js';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getDocuments() {
    return this.documentService.getDocuments();
  }
}
