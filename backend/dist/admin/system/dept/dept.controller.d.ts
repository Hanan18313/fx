import { DeptService } from './dept.service';
import { CreateDeptDto } from './dto/create-dept.dto';
import { UpdateDeptDto } from './dto/update-dept.dto';
export declare class DeptController {
    private readonly deptService;
    constructor(deptService: DeptService);
    list(): Promise<(import("../../../database/entities/sys-dept.entity").SysDeptEntity & {
        children: import("../../../database/entities/sys-dept.entity").SysDeptEntity[];
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
