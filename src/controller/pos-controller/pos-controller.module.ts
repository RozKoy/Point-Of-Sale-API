import { Module } from '@nestjs/common';

import { PosControllerController } from './pos-controller.controller';

const controllers = [PosControllerController];

@Module({
  controllers
})
export class PosControllerModule {}
