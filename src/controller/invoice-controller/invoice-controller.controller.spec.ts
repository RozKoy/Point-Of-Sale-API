import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceControllerController } from './invoice-controller.controller';

describe('InvoiceControllerController', () => {
	let controller: InvoiceControllerController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [InvoiceControllerController],
		}).compile();

		controller = module.get<InvoiceControllerController>(InvoiceControllerController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
