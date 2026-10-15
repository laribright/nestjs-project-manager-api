import type { Request } from 'express';

export type AuthUser = {
  id: number;
  role: 'admin' | 'member';
  email: string;
};

// @Deprecated
export type DemoUser = {
  id: number;
  role: 'admin' | 'member';
};

export type AuthenticatedRequest = Request & {
  user?: AuthUser;
};
