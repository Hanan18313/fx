import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { DataSource } from 'typeorm';
import { OPERATION_LOG_KEY } from '../decorators/operation-log.decorator';
import { SysOperationLogEntity } from '../../database/entities/sys-operation-log.entity';

@Injectable()
export class OperationLogInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const logMeta = this.reflector.get<{ module: string; action: string }>(
      OPERATION_LOG_KEY,
      context.getHandler(),
    );

    if (!logMeta) return next.handle();

    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          this.saveLog(request, logMeta, startTime, 1, null);
        },
        error: (err) => {
          this.saveLog(request, logMeta, startTime, 0, err.message);
        },
      }),
    );
  }

  private saveLog(
    request: any,
    logMeta: { module: string; action: string },
    startTime: number,
    status: number,
    errorMsg: string,
  ) {
    const admin = request.user;
    const log = new SysOperationLogEntity();
    log.adminId = admin?.id;
    log.adminName = admin?.username;
    log.module = logMeta.module;
    log.action = logMeta.action;
    log.method = request.method;
    log.url = request.originalUrl || request.url;
    log.requestBody = ['POST', 'PUT', 'PATCH'].includes(request.method)
      ? request.body
      : null;
    log.ip = request.ip;
    log.userAgent = request.headers?.['user-agent'];
    log.durationMs = Date.now() - startTime;
    log.status = status;
    log.errorMsg = errorMsg;

    // 异步写库，不阻塞响应
    this.dataSource
      .getRepository(SysOperationLogEntity)
      .save(log)
      .catch(() => {});
  }
}
