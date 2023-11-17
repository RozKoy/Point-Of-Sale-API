import { Test, TestingModule } from '@nestjs/testing';
import { SoldRecordService } from './sold-record.service';

describe('SoldRecordService', () => {
  let service: SoldRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SoldRecordService],
    }).compile();

    service = module.get<SoldRecordService>(SoldRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
