import { Module } from '@nestjs/common';

import { CashierAuthService } from './cashier-auth.service';
import { CashierAuthController } from './cashier-auth.controller';

const providers = [
  {
    provide: 'AUTH_CASHIER_SERVICE',
    useClass: CashierAuthService
  }
];
const controllers = [CashierAuthController];

@Module({
  providers,
  controllers
})
export class CashierAuthModule {}
