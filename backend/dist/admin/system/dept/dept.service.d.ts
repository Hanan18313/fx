import { Repository } from 'typeorm';
import { SysDeptEntity } from '../../../database/entities/sys-dept.entity';
import { CreateDeptDto } from './dto/create-dept.dto';
import { UpdateDeptDto } from './dto/update-dept.dto';
export declare class DeptService {
    private readonly deptRepo;
    constructor(deptRepo: Repository<SysDeptEntity>);
    list(): Promise<(SysDeptEntity & {
        children: SysDeptEntity[];
    })[]>;
    create(dto: CreateDeptDto): Promise<{
        id: number;
    }>;
    update(id: number, dto: UpdateDeptDto): Promise<{
        id: number;
    }>;
    delete(id: number): Promise<{
        id: number;
    }>;
}
