import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressEntity } from '../database/entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepo: Repository<AddressEntity>,
  ) {}

  async list(userId: number) {
    const data = await this.addressRepo.find({
      where: { userId },
      order: { isDefault: 'DESC', id: 'DESC' },
    });
    return { data };
  }

  async create(userId: number, dto: CreateAddressDto) {
    if (dto.is_default === 1) {
      await this.addressRepo.update({ userId }, { isDefault: 0 });
    }

    const address = this.addressRepo.create({
      userId,
      name: dto.name,
      phone: dto.phone,
      province: dto.province,
      city: dto.city,
      district: dto.district,
      detail: dto.detail,
      isDefault: dto.is_default ?? 0,
    });
    const saved = await this.addressRepo.save(address);
    return saved;
  }

  async update(id: number, userId: number, dto: Partial<CreateAddressDto>) {
    const address = await this.addressRepo.findOne({ where: { id } });
    if (!address) throw new NotFoundException('地址不存在');
    if (address.userId !== userId) throw new ForbiddenException('无权操作');

    if (dto.is_default === 1) {
      await this.addressRepo.update({ userId }, { isDefault: 0 });
    }

    const updateData: Partial<AddressEntity> = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.province !== undefined) updateData.province = dto.province;
    if (dto.city !== undefined) updateData.city = dto.city;
    if (dto.district !== undefined) updateData.district = dto.district;
    if (dto.detail !== undefined) updateData.detail = dto.detail;
    if (dto.is_default !== undefined) updateData.isDefault = dto.is_default;

    await this.addressRepo.update(id, updateData);
    return { message: '更新成功' };
  }

  async remove(id: number, userId: number) {
    const address = await this.addressRepo.findOne({ where: { id } });
    if (!address) throw new NotFoundException('地址不存在');
    if (address.userId !== userId) throw new ForbiddenException('无权操作');

    await this.addressRepo.delete(id);
    return { message: '删除成功' };
  }
}
