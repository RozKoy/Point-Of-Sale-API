import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { 
  Configuration, 
  TypeOrmConfig 
} from './config';
import { AdminModule } from './user/admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true, 
      load: [Configuration] 
    }), 
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfig,
    }), AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}