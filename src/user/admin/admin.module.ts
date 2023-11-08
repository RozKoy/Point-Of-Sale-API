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

@Module({
  providers,
  controllers: [AdminController],
  imports: [TypeOrmModule.forFeature([AdminEntity])]
})
export class AdminModule {}
