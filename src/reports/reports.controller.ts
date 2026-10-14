import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  summary() {
    return this.reportsService.summary();
  }

  @Get('email-preview')
  previewEmail() {
    return this.reportsService.previewEmail();
  }
}
