import type { Request } from 'express';

export type DemoUser = {
  id: number;
  role: 'admin' | 'member';
};

export type AuthenticatedRequest = Request & {
  user?: DemoUser;
};
