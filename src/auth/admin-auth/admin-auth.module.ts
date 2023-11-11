import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtConfigService } from 'src/config';
import { JwtStrategy } from './utils/jwt.strategy';
import { AdminAuthService } from './admin-auth.service';
import { AdminModule } from 'src/user/admin/admin.module';
import { AdminAuthEntity } from './entity/admin-auth.entity';
import { AdminAuthController } from './admin-auth.controller';

const imports = [
  AdminModule,
  TypeOrmModule.forFeature([AdminAuthEntity]),
  JwtModule.registerAsync({ imports: [ConfigModule], useClass: JwtConfigService })
];
const providers = [
  {
    provide: 'AUTH_ADMIN_SERVICE',
    useClass: AdminAuthService
  },
  {
    provide: 'JWT_STRATEGY',
    useClass: JwtStrategy
  }
];
const controllers = [AdminAuthController];

@Module({
  imports,
  providers,
  controllers
})
export class AdminAuthModule {}
