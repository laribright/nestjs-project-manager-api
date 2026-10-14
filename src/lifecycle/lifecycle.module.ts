import { Module } from '@nestjs/common';

import { LifecycleDemoService } from './lifecycle-demo.service';
import { LifecycleController } from './lifecycle.controller';

@Module({
  providers: [LifecycleDemoService],
  controllers: [LifecycleController],
})
export class LifecycleModule {}
