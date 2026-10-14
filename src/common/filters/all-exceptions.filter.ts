import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    const isHttpError = exception instanceof HttpException;

    const status = isHttpError
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const details = isHttpError
      ? exception.getResponse()
      : { message: 'Internal server error' };

    if (!isHttpError) {
      this.logger.error(
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    return response.status(status).json({
      statusCode: status,
      error: details,
      path: request.originalUrl,
      timestamp: new Date().toISOString(),
    });
  }
}
