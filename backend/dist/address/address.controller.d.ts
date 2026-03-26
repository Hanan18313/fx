import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
export declare class AddressController {
    private readonly addressService;
    constructor(addressService: AddressService);
    list(req: any): Promise<{
        data: import("../database/entities/address.entity").AddressEntity[];
    }>;
    create(req: any, dto: CreateAddressDto): Promise<import("../database/entities/address.entity").AddressEntity>;
    update(id: number, req: any, dto: Partial<CreateAddressDto>): Promise<{
        message: string;
    }>;
    remove(id: number, req: any): Promise<{
        message: string;
    }>;
}
