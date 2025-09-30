/* eslint-disable prefer-const */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { CannotCreateEntityIdMapError, EntityNotFoundError, QueryFailedError } from 'typeorm';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let message;
    let code;
    let status;

    switch (exception.constructor) {
      case HttpException:
        status = (exception as HttpException)?.getStatus();
        message = (exception as QueryFailedError)?.message;
        break;
      case QueryFailedError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as QueryFailedError)?.message;
        break;
      case EntityNotFoundError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as EntityNotFoundError)?.message;
        break;
      case CannotCreateEntityIdMapError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as CannotCreateEntityIdMapError)?.message;
        break;
      case TypeError:
        status = HttpStatus.BAD_REQUEST;
        message = (exception as TypeError)?.message || 'message null';
        break;
      default:
        status = HttpStatus.BAD_REQUEST;
        message = (exception as any)?.message || 'message null';
    }

    code = (exception as any).name;

    this.logger.error(
      `AllExceptionFilter ${code} - ${message} `,
      AllExceptionFilter.name
    );

    response.status(status).json({ status, code, message });
  }
}
