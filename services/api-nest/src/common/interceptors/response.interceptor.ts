import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import type { Request, Response } from 'express';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>
    ): Observable<any> | Promise<Observable<any>> {
        const ctx = context.switchToHttp();
        const { url } = ctx.getRequest<Request>();
        const { statusCode } = ctx.getResponse<Response>();

        return next.handle().pipe(
            map((data) => {
                if (statusCode !== 204) {
                    return {
                        statusCode,
                        success: true,
                        data: data.data ?? null,
                        message:
                            data.message ?? 'Operação realizada com sucesso.',
                        timestamp: new Date().toISOString(),
                        path: url,
                    };
                }
            })
        );
    }
}
