import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { ReportsModule } from './reports/reports.module';
import { ClockModule } from './common/clock.module';

@Module({
  imports: [TasksModule, ReportsModule, ClockModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
