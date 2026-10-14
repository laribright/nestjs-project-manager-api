import { Controller, Get } from '@nestjs/common';
import { LifecycleDemoService } from './lifecycle-demo.service';

@Controller('lifecycle')
export class LifecycleController {
  constructor(private readonly lifecycleDemoService: LifecycleDemoService) {}

  @Get()
  getSnapshot() {
    return this.lifecycleDemoService.snapshot();
  }
}
