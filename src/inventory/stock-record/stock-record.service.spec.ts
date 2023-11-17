import { Test, TestingModule } from '@nestjs/testing';
import { StockRecordService } from './stock-record.service';

describe('StockRecordService', () => {
  let service: StockRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockRecordService],
    }).compile();

    service = module.get<StockRecordService>(StockRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
