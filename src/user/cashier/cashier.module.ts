import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CashierService } from './cashier.service';
import { CashierEntity } from './entity/cashier.entity';
import { CashierController } from './cashier.controller';

const providers = [
  {
    provide: 'CASHIER_SERVICE',
    useClass: CashierService
  }
];

@Module({
  providers,
  controllers: [CashierController],
  imports: [TypeOrmModule.forFeature([CashierEntity])]
})
export class CashierModule {}
