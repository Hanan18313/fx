import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SysOperationLogEntity } from '../../../database/entities/sys-operation-log.entity';
import { SysLoginLogEntity } from '../../../database/entities/sys-login-log.entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(SysOperationLogEntity)
    private readonly operationLogRepo: Repository<SysOperationLogEntity>,
    @InjectRepository(SysLoginLogEntity)
    private readonly loginLogRepo: Repository<SysLoginLogEntity>,
  ) {}

  async listOperationLogs(query: {
    page?: number;
    pageSize?: number;
    module?: string;
    action?: string;
    adminName?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;

    const qb = this.operationLogRepo.createQueryBuilder('log');

    if (query.module) {
      qb.andWhere('log.module LIKE :module', { module: `%${query.module}%` });
    }
    if (query.action) {
      qb.andWhere('log.action LIKE :action', { action: `%${query.action}%` });
    }
    if (query.adminName) {
      qb.andWhere('log.admin_name LIKE :adminName', { adminName: `%${query.adminName}%` });
    }
    if (query.startDate) {
      qb.andWhere('log.created_at >= :startDate', { startDate: query.startDate });
    }
    if (query.endDate) {
      qb.andWhere('log.created_at <= :endDate', { endDate: query.endDate });
    }

    const total = await qb.getCount();
    const list = await qb
      .orderBy('log.created_at', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();

    return { list, total, page, pageSize };
  }

  async listLoginLogs(query: {
    page?: number;
    pageSize?: number;
    username?: string;
    status?: number;
    startDate?: string;
    endDate?: string;
  }) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;

    const qb = this.loginLogRepo.createQueryBuilder('log');

    if (query.username) {
      qb.andWhere('log.username LIKE :username', { username: `%${query.username}%` });
    }
    if (query.status !== undefined && query.status !== null) {
      qb.andWhere('log.status = :status', { status: query.status });
    }
    if (query.startDate) {
      qb.andWhere('log.created_at >= :startDate', { startDate: query.startDate });
    }
    if (query.endDate) {
      qb.andWhere('log.created_at <= :endDate', { endDate: query.endDate });
    }

    const total = await qb.getCount();
    const list = await qb
      .orderBy('log.created_at', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();

    return { list, total, page, pageSize };
  }
}
