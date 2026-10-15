import { SetMetadata } from '@nestjs/common';
import { AuthUser } from '../types/authenticated-request';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AuthUser['role'][]) =>
  SetMetadata(ROLES_KEY, roles);
