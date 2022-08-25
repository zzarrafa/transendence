import { Module } from '@nestjs/common';
import { TwoFactController } from './two-fact.controller';
import { TwoFactService } from './two-fact.service';

@Module({
  controllers: [TwoFactController],
  providers: [TwoFactService]
})
export class TwoFactModule {}
