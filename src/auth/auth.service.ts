import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID, randomBytes, createHash } from 'crypto';

import { AuthRepository } from './auth.repository';
import { CredentialsDto } from './dto/credentials.dto';
import * as argon2 from 'argon2';

function isUniqueViolation(error: unknown): boolean {
  let current = error;

  for (
    let depth = 0;
    depth < 5 && current && typeof current === 'object';
    depth++
  ) {
    if ('code' in current && current.code === '23505') {
      return true;
    }
    current = 'cause' in current ? current.cause : undefined;
  }
  return false;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CredentialsDto) {
    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });

    try {
      return this.authRepository.createUser(dto.email, passwordHash);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException('Email already in use');
      }
      throw error;
    }
  }

  async login(dto: CredentialsDto) {
    const user = await this.authRepository.findByEmail(dto.email);
    const valid = user
      ? await argon2.verify(user.passwordHash, dto.password)
      : false;

    if (!user || !valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueTokenPair(user.id);
  }

  async refresh(refreshToken: string) {
    const sessionId = this.refreshSessionId(refreshToken);
    const nextRefreshToken = this.createRefreshToken(sessionId);
    const session = await this.authRepository.rotateSession({
      id: sessionId,
      oldHash: this.hashRefreshToken(refreshToken),
      newHash: this.hashRefreshToken(nextRefreshToken),
    });
    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return {
      accessToken: await this.signAccessToken(session.userId),
      refreshToken: nextRefreshToken,
      tokenType: 'Bearer',
      expiresIn: 900,
    };
  }

  async logout(refreshToken: string) {
    const sessionId = this.refreshSessionId(refreshToken);
    await this.authRepository.revokeSession(
      sessionId,
      this.hashRefreshToken(refreshToken),
    );
    return { loggedOut: true };
  }

  findSafeUser(id: number) {
    return this.authRepository.findSafeUser(id);
  }

  async verifyAccessToken(token: string) {
    return this.jwtService.verifyAsync<{ sub: string }>(token);
  }

  private async signAccessToken(userId: number) {
    return this.jwtService.signAsync({ sub: userId });
  }

  private hashRefreshToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private createRefreshToken(sessionId: string) {
    return `${sessionId}.${randomBytes(32).toString('hex')}`;
  }

  private refreshSessionId(token: string): string {
    const match =
      /^([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\.[0-9a-f]{64}$/.exec(
        token,
      );
    if (!match) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return match[1];
  }

  private async issueTokenPair(userId: number) {
    const sessionId = randomUUID();
    const refreshToken = this.createRefreshToken(sessionId);
    const accessToken = await this.signAccessToken(userId);
    await this.authRepository.createSession({
      id: sessionId,
      userId,
      tokenHash: this.hashRefreshToken(refreshToken),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    });

    return { accessToken, refreshToken, tokenType: 'Bearer', expiresIn: 900 };
  }
}
