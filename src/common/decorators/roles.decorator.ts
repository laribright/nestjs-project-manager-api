import { SetMetadata } from '@nestjs/common';
import { DemoUser } from '../types/authenticated-request';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: DemoUser['role'][]) =>
  SetMetadata(ROLES_KEY, roles);
