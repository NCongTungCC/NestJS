import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    console.log('3');
    const errorResponse = exception.getResponse();
    response
      .status(status)
      .json(
        typeof errorResponse === 'object'
          ? { ...errorResponse }
          : { message: errorResponse },
      );
  }
}
