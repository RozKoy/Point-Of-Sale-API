import { Test, TestingModule } from '@nestjs/testing';
import { InventoryControllerController } from './inventory-controller.controller';

describe('InventoryControllerController', () => {
	let controller: InventoryControllerController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [InventoryControllerController],
		}).compile();

		controller = module.get<InventoryControllerController>(InventoryControllerController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
