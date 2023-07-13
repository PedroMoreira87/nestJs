import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ClassConstructor, plainToInstance} from 'class-transformer';

// To make the use of the interceptor shorter and verify if it's a class
export function Serialize(dto: ClassConstructor<unknown>) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: ClassConstructor<unknown>) {
    }

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        // Run something before a request is handled by the request handler
        return handler.handle().pipe(
            map((data: any) => {
                // Run something before the response is sent out
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true,
                });
            }),
        );
    }
}
