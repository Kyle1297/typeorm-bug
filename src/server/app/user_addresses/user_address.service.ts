import { Injectable } from '@nestjs/common';
import { UserAddress } from './user_address.entity';
import { AddUserAddressInput } from './input/add_user_address.input';
import { UserAddressRepository } from './user_address.repository';
import { User } from '../users/user.entity';
import validateEntity from 'src/server/common/utils/validateEntity';
import { UpdateUserAddressInput } from './input/update_user_address.input';

@Injectable()
export class UserAddressService {
  constructor(private readonly userAddressRepository: UserAddressRepository) {}

  async save(
    userAddress: AddUserAddressInput,
    user: User,
  ): Promise<UserAddress> {
    const preparedUserAddress = this.userAddressRepository.create({
      ...userAddress,
      user,
    });

    return this.userAddressRepository.save(preparedUserAddress);
  }

  async remove(id: string, user: User): Promise<UserAddress> {
    const userAddress = await this.userAddressRepository.findOneOrError(id);

    if (userAddress.user.id !== user.id) {
      throw new Error(
        'Unauthorized: Only the owner of this address can remove it',
      );
    }

    return this.userAddressRepository.remove(userAddress);
  }

  async update(
    id: string,
    userAddressData: UpdateUserAddressInput,
    user: User,
  ): Promise<UserAddress> {
    const userAddress = await this.userAddressRepository.findOneOrError(id);

    if (userAddress.user.id !== user.id) {
      throw new Error(
        'Unauthorized: Only the owner of this address can update it',
      );
    }

    // save does not trigger validation, so need to do it manually
    for (const [key, value] of Object.entries(userAddressData)) {
      userAddress[key] = value;
    }
    await validateEntity(userAddress);

    return this.userAddressRepository.save({ ...userAddressData, id });
  }
}
