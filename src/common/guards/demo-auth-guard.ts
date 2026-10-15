import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../types/authenticated-request';

@Injectable()
export class DemoAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    console.log('[guard]: authentication');
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const credential = request.headers.authorization;

    // if (credential === 'Bearer demo-admin') {
    //   request.user = {
    //     id: 1,
    //     role: 'admin',
    //   };
    //   return true;
    // }

    // if (credential === 'Bearer demo-member') {
    //   request.user = {
    //     id: 2,
    //     role: 'member',
    //   };
    //   return true;
    // }

    throw new UnauthorizedException('Invalid credential');
  }
}
