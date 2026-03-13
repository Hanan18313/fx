import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { DataSource } from 'typeorm';
export declare class OperationLogInterceptor implements NestInterceptor {
    private readonly reflector;
    private readonly dataSource;
    constructor(reflector: Reflector, dataSource: DataSource);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private saveLog;
}
