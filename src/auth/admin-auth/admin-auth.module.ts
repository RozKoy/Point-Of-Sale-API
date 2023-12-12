import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';

import { AdminJwtStrategy } from 'src/utils';
import { AdminAuthService } from './admin-auth.service';
import { AdminModule } from 'src/user/admin/admin.module';
import { MailerAccount, JwtConfigService } from 'src/config';
import { AdminAuthEntity } from './entity/admin-auth.entity';
import { AdminAuthController } from './admin-auth.controller';

const imports = [
  AdminModule,
  TypeOrmModule.forFeature([AdminAuthEntity]),
  JwtModule.registerAsync({ imports: [ConfigModule], useClass: JwtConfigService }),
  MailerModule.forRoot({ 
    transport: { 
      host: 'smtp.gmail.com', 
      auth: MailerAccount
    } 
  })
];
const providers = [
  {
    provide: 'AUTH_ADMIN_SERVICE',
    useClass: AdminAuthService
  },
  {
    provide: 'ADMIN_JWT_STRATEGY',
    useClass: AdminJwtStrategy
  }
];
const controllers = [AdminAuthController];

@Module({
  imports,
  providers,
  controllers
})
export class AdminAuthModule {}
