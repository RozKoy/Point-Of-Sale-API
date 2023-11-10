import { Module } from '@nestjs/common';

import { CashierAuthService } from './cashier-auth.service';
import { CashierAuthController } from './cashier-auth.controller';

const providers = [
  {
    provide: 'AUTH_CASHIER_SERVICE',
    useClass: CashierAuthService
  }
];

@Module({
  providers,
  controllers: [CashierAuthController]
})
export class CashierAuthModule {}
