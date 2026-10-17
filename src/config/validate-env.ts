import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  APP_NAME: z.string().trim().min(1).default('Project Manager API'),
  TASK_DEFAULT_STATUS: z.enum(['todo', 'done']).default('todo'),
  MAIL_FROM: z.string().trim().pipe(z.email()),
  DATABASE_URL: z
    .url()
    .refine(
      (value) =>
        ['postgresql', 'postgresql:'].includes(new URL(value).protocol),
      {
        message: 'DATABASE_URL must be a valid PostgreSQL URL',
      },
    ),
  JWT_ACCESS_SECRET: z.string().trim().min(64),
  UPSTASH_REDIS_HOST: z.string().trim().min(1),
  UPSTASH_REDIS_PORT: z.coerce.number().int().min(1).max(65535).default(6379),
  UPSTASH_REDIS_PASSWORD: z.string().min(1),
});

export function validateEnv(env: Record<string, unknown>) {
  const result = envSchema.safeParse(env);

  if (!result.success) {
    const messages = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(`Invalid environment variables:\n${messages}`);
  }

  return { ...env, ...result.data };
}
