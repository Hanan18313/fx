import { Repository } from 'typeorm';
import { AddressEntity } from '../database/entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
export declare class AddressService {
    private readonly addressRepo;
    constructor(addressRepo: Repository<AddressEntity>);
    list(userId: number): Promise<{
        data: AddressEntity[];
    }>;
    create(userId: number, dto: CreateAddressDto): Promise<AddressEntity>;
    update(id: number, userId: number, dto: Partial<CreateAddressDto>): Promise<{
        message: string;
    }>;
    remove(id: number, userId: number): Promise<{
        message: string;
    }>;
}
