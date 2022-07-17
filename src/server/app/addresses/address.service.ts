import { Injectable } from '@nestjs/common';
import { Address } from './address.entity';
import { AddAddressInput } from './input/add-address.input';
import { AddressRepository } from './address.repository';
import { User } from '../users/user.entity';
import { PolymorphicChildInterface } from 'src/server/common/types/PolymorphicChildInterface';

@Injectable()
export class AddressService {
  constructor(private readonly addresssRepository: AddressRepository) {}

  async save(address: AddAddressInput, user: User): Promise<Address> {
    const preparedAddress = this.addresssRepository.create({
      ...address,
      entityId: user.id,
      entityType: User.name,
    });

    return this.addresssRepository.save(preparedAddress);
  }

  async remove(
    id: string,
    entity: PolymorphicChildInterface,
  ): Promise<Address> {
    const address = await this.addresssRepository.findOneOrFail({
      where: { id },
    });

    // validate that the address belongs to the entity
    if (
      address.entityType !== entity.entityType ||
      address.entityId !== entity.entityId
    ) {
      throw new Error(
        `Unauthorized: Address does not belong to ${entity.entityType} with id ${entity.entityId}`,
      );
    }

    return this.addresssRepository.remove(address);
  }
}
