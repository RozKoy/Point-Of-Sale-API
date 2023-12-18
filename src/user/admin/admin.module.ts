import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminService } from './admin.service';
import { AdminEntity } from './entity/admin.entity';
import { AdminController } from './admin.controller';

const providers = [
{
	provide: 'ADMIN_SERVICE',
	useClass: AdminService
}
];
const controllers = [AdminController];
const imports = [TypeOrmModule.forFeature([AdminEntity])];

@Module({
	imports,
	providers,
	controllers,
	exports: providers
})
export class AdminModule {}
