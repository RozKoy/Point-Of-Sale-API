import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceDeleteService } from './invoice-delete.service';

describe('InvoiceDeleteService', () => {
  let service: InvoiceDeleteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoiceDeleteService],
    }).compile();

    service = module.get<InvoiceDeleteService>(InvoiceDeleteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
