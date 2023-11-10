import { Module } from '@nestjs/common';

import { AdminAuthService } from './admin-auth.service';
import { AdminAuthController } from './admin-auth.controller';

const providers = [
  {
    provide: 'AUTH_ADMIN_SERVICE',
    useClass: AdminAuthService
  }
];

@Module({
  providers,
  controllers: [AdminAuthController],
})
export class AdminAuthModule {}
