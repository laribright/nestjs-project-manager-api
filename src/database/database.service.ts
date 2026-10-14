import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly pool: Pool;
  readonly db: ReturnType<typeof drizzle>;

  constructor(config: ConfigService) {
    this.pool = new Pool({
      connectionString: config.getOrThrow<string>('DATABASE_URL'),
      max: 10,
    });
    this.pool.on('error', (error) => {
      this.logger.error('Idle postgresql connection error', error.stack);
    });

    this.db = drizzle({ client: this.pool });
  }

  async onModuleInit() {
    try {
      await this.pool.query('SELECT 1');
      this.logger.log('Database connection verified');
    } catch (error) {
      await this.pool.end();
      throw error;
    }
  }

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
    this.logger.log('PostgreSQL pool closed');
  }
}
