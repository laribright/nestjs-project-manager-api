import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { lt } from 'drizzle-orm';

import { DatabaseService } from '../database/database.service';
import { refreshSesssions } from '../database/schema';

@Injectable()
export class SessionCleanupService {
  private readonly logger = new Logger(SessionCleanupService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  @Cron(CronExpression.EVERY_30_SECONDS, { waitForCompletion: true })
  async removeExpiredSessions(): Promise<void> {
    try {
      const remove = await this.databaseService.db
        .delete(refreshSesssions)
        .where(lt(refreshSesssions.expiresAt, new Date()))
        .returning({ id: refreshSesssions.id });

      this.logger.log(`Removed ${remove.length} expired sessions`);
    } catch (error) {
      this.logger.error('Error removing expired sessions', error);
    }
  }
}
