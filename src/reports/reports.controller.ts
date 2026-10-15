import { Controller, Get } from '@nestjs/common';

import { ReportsService } from './reports.service';
import type { AuthUser } from '../common/types/authenticated-request';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  summary(@CurrentUser() user: AuthUser) {
    return this.reportsService.summary(user.id);
  }

  @Get('email-preview')
  previewEmail() {
    return this.reportsService.previewEmail();
  }
}
