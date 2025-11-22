import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import type { Response, Request } from 'express';
import type { GetResponseExceptionFilter } from '../interfaces/get-response-exception.filter';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const { url } = ctx.getRequest<Request>();
        const statusCode = exception.getStatus();
        const res = exception.getResponse() as GetResponseExceptionFilter;
        const message =
            typeof res === 'string'
                ? res
                : Array.isArray(res.message)
                  ? res.message.join('')
                  : res.message || 'Error inesperado.';

        response.status(statusCode).json({
            statusCode,
            success: false,
            error: exception.name,
            message,
            timestamp: new Date().toISOString(),
            path: url,
        });
    }
}
