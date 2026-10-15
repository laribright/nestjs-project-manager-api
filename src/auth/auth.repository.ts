import { Injectable } from '@nestjs/common';
import { eq, gt, and } from 'drizzle-orm';

import { DatabaseService } from '../database/database.service';
import { refreshSesssions, users } from '../database/schema';

@Injectable()
export class AuthRepository {
  constructor(private readonly database: DatabaseService) {}

  async createUser(email: string, passwordHash: string) {
    const [user] = await this.database.db
      .insert(users)
      .values({ email, passwordHash })
      .returning({ id: users.id, email: users.email, role: users.role });

    return user;
  }

  async findByEmail(email: string) {
    const [user] = await this.database.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user; // Hash is used internally for comparing the user password with the provided password
  }

  async findSafeUser(id: number) {
    const [user] = await this.database.db
      .select({ id: users.id, email: users.email, role: users.role })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user;
  }

  async createSession({
    userId,
    tokenHash,
    expiresAt,
    id,
  }: {
    id: string;
    userId: number;
    tokenHash: string;
    expiresAt: Date;
  }) {
    await this.database.db
      .insert(refreshSesssions)
      .values({ id, userId, tokenHash, expiresAt });
  }

  async rotateSession({
    id,
    oldHash,
    newHash,
  }: {
    id: string;
    oldHash: string;
    newHash: string;
  }) {
    const [session] = await this.database.db
      .update(refreshSesssions)
      .set({ tokenHash: newHash })
      .where(
        and(
          eq(refreshSesssions.id, id),
          eq(refreshSesssions.tokenHash, oldHash),
          gt(refreshSesssions.expiresAt, new Date()),
        ),
      )
      .returning({ userId: refreshSesssions.userId });

    return session;
  }

  async revokeSession(id: string, tokenHash: string) {
    await this.database.db
      .delete(refreshSesssions)
      .where(
        and(
          eq(refreshSesssions.id, id),
          eq(refreshSesssions.tokenHash, tokenHash),
        ),
      );
  }
}
