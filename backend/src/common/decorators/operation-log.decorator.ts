import { SetMetadata } from '@nestjs/common';

export const OPERATION_LOG_KEY = 'operation_log';
export const OperationLog = (module: string, action: string) =>
  SetMetadata(OPERATION_LOG_KEY, { module, action });
