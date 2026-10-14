import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TasksModule } from '../tasks/tasks.module';
import { MailModule } from '../mail/mail.module';
import { MailOptions } from '../mail/mail.constants';

@Module({
  // imports: [TasksModule, MailModule.forRoot({ from: 'reports@example.com' })],
  imports: [
    TasksModule,
    MailModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): MailOptions => ({
        from: configService.getOrThrow('MAIL_FROM'),
      }),
    }),
  ],
  providers: [ReportsService],
  controllers: [ReportsController],
  exports: [ReportsService],
})
export class ReportsModule {}

// MailModule.forRoot({ from: 'reports@example.com' })
