import {
  ExecutionContext,
  Injectable,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap, finalize } from 'rxjs';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const started = Date.now();
    console.log('[interceptor] before handler');

    return next.handle().pipe(
      tap({
        next: () => console.log('[interceptor] successful result'),
        error: () => console.log('[interceptor] downstream error'),
      }),
      finalize(() =>
        console.log(`[interceptor] finished in ${Date.now() - started}ms`),
      ),
    );
  }
}
