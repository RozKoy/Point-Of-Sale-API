import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DraftService } from './draft.service';
import { InvoiceDraftEntity } from './entity/draft.entity';

const providers = [
   {
      provide: 'DRAFT_SERVICE',
      useClass: DraftService
   }
];
const imports = [TypeOrmModule.forFeature([InvoiceDraftEntity])];

@Module({
   imports,
   providers,
   exports: providers
})
export class DraftModule {}
