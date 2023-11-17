import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { Configuration, TypeOrmConfig } from './config';
import { AdminModule } from './user/admin/admin.module';
import { UnitModule } from './product/unit/unit.module';
import { PrizeModule } from './product/prize/prize.module';
import { CashierModule } from './user/cashier/cashier.module';
import { ProductModule } from './product/product/product.module';
import { CategoryModule } from './product/category/category.module';
import { AdminAuthModule } from './auth/admin-auth/admin-auth.module';
import { CashierAuthModule } from './auth/cashier-auth/cashier-auth.module';
import { ProductExpiredDateModule } from './product/product-expired-date/product-expired-date.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true, 
      load: [Configuration] 
    }), 
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfig,
    }), 
    UnitModule, 
    PrizeModule, 
    AdminModule, 
    CashierModule, 
    ProductModule,
    CategoryModule, 
    AdminAuthModule, 
    CashierAuthModule, 
    ProductExpiredDateModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
