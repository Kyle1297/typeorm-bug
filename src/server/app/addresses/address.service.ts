import { Injectable } from '@nestjs/common';
import { Address, AddressableTypes } from './address.entity';
import { AddAddressInput } from './input/add-address.input';
import { AddressRepository } from './address.repository';
import { User } from '../users/user.entity';
import { PolymorphicChildInterface } from 'src/server/common/types/PolymorphicChildInterface';
import validateEntity from 'src/server/common/utils/validateEntity';
import { UpdateAddressInput } from './input/update-address.input';
import validateAddressEntityOwnership from './utils/validateAddressEntityOwnership';

@Injectable()
export class AddressService {
  constructor(private readonly addressRepository: AddressRepository) {}

  async save(address: AddAddressInput, user: User): Promise<Address> {
    const preparedAddress = this.addressRepository.create({
      ...address,
      entityId: user.id,
      entityType: 'User',
    });

    return this.addressRepository.save(preparedAddress);
  }

  async remove(
    id: string,
    entity: PolymorphicChildInterface<AddressableTypes>,
  ): Promise<Address> {
    const address = await this.addressRepository.findOneOrError(id);

    validateAddressEntityOwnership(address, entity);

    return this.addressRepository.remove(address);
  }

  async update(
    id: string,
    addressData: UpdateAddressInput,
    entity: PolymorphicChildInterface<AddressableTypes>,
  ): Promise<Address> {
    const address = await this.addressRepository.findOneOrError(id);

    validateAddressEntityOwnership(address, entity);

    for (const [key, value] of Object.entries(addressData)) {
      address[key] = value;
    }
    address.validateAddressTypeAndInstructions();
    await validateEntity(address);

    return this.addressRepository.save({ ...addressData, id });
  }
}
