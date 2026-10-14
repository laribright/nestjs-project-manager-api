import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddlware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[middleware] ${req.method} ${req.originalUrl}`);
    next();
  }
}
