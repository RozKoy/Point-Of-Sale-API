import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtConfigService } from 'src/config';
import { CashierJwtStrategy } from './utils/jwt.strategy';
import { CashierAuthService } from './cashier-auth.service';
import { CashierModule } from 'src/user/cashier/cashier.module';
import { CashierAuthEntity } from './entity/cashier-auth.entity';
import { CashierAuthController } from './cashier-auth.controller';

const imports = [
  CashierModule,
  TypeOrmModule.forFeature([CashierAuthEntity]),
  JwtModule.registerAsync({ imports: [ConfigModule], useClass: JwtConfigService })
];
const providers = [
  {
    provide: 'AUTH_CASHIER_SERVICE',
    useClass: CashierAuthService
  },
  {
    provide: 'CASHIER_JWT_STRATEGY',
    useClass: CashierJwtStrategy
  }
];
const controllers = [CashierAuthController];

@Module({
  imports,
  providers,
  controllers
})
export class CashierAuthModule {}
