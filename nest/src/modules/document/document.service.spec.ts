import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service.js';

describe('DocumentService', () => {
  let service: DocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentService],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns all documents with warning thresholds', () => {
    const response = service.getDocuments();

    expect(response.today).toBe('2026-05-31');
    expect(response.thresholds.warningDays).toBe(30);
    expect(response.documents).toHaveLength(5);
    expect(response.documents).toContainEqual({
      id: 'doc_license',
      label: 'Indonesian License Exp. Date',
      expiryDate: '2026-05-29',
    });
  });
});
