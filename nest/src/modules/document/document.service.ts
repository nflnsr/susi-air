import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentService {
  getDocuments() {
    return {
      today: '2026-05-31',
      thresholds: {
        warningDays: 30,
      },
      documents: [
        {
          id: 'doc_recurrent',
          label: 'Next Recurrent Date',
          expiryDate: '2026-10-14',
        },
        {
          id: 'doc_ppc',
          label: 'PPC Exp. Date',
          expiryDate: '2026-12-25',
        },
        {
          id: 'doc_license',
          label: 'Indonesian License Exp. Date',
          expiryDate: '2026-05-29',
        },
        {
          id: 'doc_medical',
          label: 'Indonesian Medical Exp. Date',
          expiryDate: '2026-06-11',
        },
        {
          id: 'doc_security',
          label: 'Security Clearance Exp. Date',
          expiryDate: '2026-05-01',
        },
      ],
    };
  }
}
