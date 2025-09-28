import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { errorBadRequest } from '../../assets/textErrors/extensionn';

@Catch(HttpException)
export class ExtensionExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const { response, httpStatus } = errorBadRequest;
    res.status(httpStatus || status).send({ response });
  }
}
