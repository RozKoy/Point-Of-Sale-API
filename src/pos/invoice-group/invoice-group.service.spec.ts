import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceGroupService } from './invoice-group.service';

describe('InvoiceGroupService', () => {
  let service: InvoiceGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoiceGroupService],
    }).compile();

    service = module.get<InvoiceGroupService>(InvoiceGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
