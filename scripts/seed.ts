import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

import { tasks } from '../src/database/schema';

async function seed() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error('DATABASE_URL is not set');
  }

  const pool = new Pool({
    connectionString: url,
  });

  const db = drizzle({ client: pool });

  try {
    await db.insert(tasks).values([
      { title: 'Learn Nest', status: 'todo' },
      { title: 'Review', status: 'done' },
    ]);
    console.log('Seed completed');
  } finally {
    await pool.end();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
