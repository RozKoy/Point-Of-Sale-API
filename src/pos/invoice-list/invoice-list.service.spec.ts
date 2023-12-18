import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceListService } from './invoice-list.service';

describe('InvoiceListService', () => {
	let service: InvoiceListService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [InvoiceListService],
		}).compile();

		service = module.get<InvoiceListService>(InvoiceListService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
