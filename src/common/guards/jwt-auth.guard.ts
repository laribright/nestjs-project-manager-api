import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from '../../auth/auth.service';
import { AuthenticatedRequest } from '../types/authenticated-request';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const [scheme, token] = request.headers.authorization?.split(' ') ?? []; // (Authorization: Bearer <token>).split(' ') => ['Bearer', <token>]

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    let subject: string;

    try {
      const payload = await this.authService.verifyAccessToken(token); // { sub: <userId> }

      subject = payload.sub;
    } catch {
      throw new UnauthorizedException('Missing or invalid access token');
    }

    const id = Number(subject);

    if (!Number.isSafeInteger(id)) {
      throw new UnauthorizedException('Missing or invalid access token');
    }

    const user = await this.authService.findSafeUser(id);
    if (!user) {
      throw new UnauthorizedException('Missing or invalid access token');
    }

    request.user = user;
    return true;
  }
}
