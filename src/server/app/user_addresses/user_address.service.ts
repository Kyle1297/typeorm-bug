import { Injectable } from '@nestjs/common';
import { UserAddress } from './user_address.entity';
import { AddUserAddressInput } from './input/add_user_address.input';
import { UserAddressRepository } from './user_address.repository';
import { User } from '../users/user.entity';
import { validateEntity } from 'src/server/common/utils/validateEntity';
import { UpdateUserAddressInput } from './input/update_user_address.input';
import { PaymentService } from '../payments/payment.service';

@Injectable()
export class UserAddressService {
  constructor(
    private readonly userAddressRepository: UserAddressRepository,
    private readonly paymentService: PaymentService,
  ) {}

  async findOne(id: string, user: User, action = 'view'): Promise<UserAddress> {
    const address = await this.userAddressRepository.findOneOrError(id);

    if (address.user.id !== user.id) {
      throw new Error(
        `Unauthorized: Only the owner of this address can ${action} it`,
      );
    }

    return address;
  }

  async findAll(user: User): Promise<UserAddress[]> {
    return await this.userAddressRepository.find({
      relations: ['user', 'user.addresses'],
      where: { user },
    });
  }

  async updateStripeCustomerAddress(
    userAddress: UserAddress,
    user: User,
  ): Promise<void> {
    const stripeData = {};
    if (userAddress.isSelectedPickup) {
      stripeData['address'] = {
        line1: userAddress.line1,
        line2: userAddress.line2,
        city: userAddress.locality,
        state: userAddress.administrativeArea,
        postal_code: userAddress.postalCode,
        country: userAddress.countryCode,
      };
    }

    if (userAddress.isSelectedDelivery) {
      stripeData['shipping'] = {
        name: user.fullName,
        phone: user.phoneNumber,
        address: {
          line1: userAddress.line1,
          line2: userAddress.line2,
          city: userAddress.locality,
          state: userAddress.administrativeArea,
          postal_code: userAddress.postalCode,
          country: userAddress.countryCode,
        },
      };
    }

    await this.paymentService.updateCustomer(user.stripeCustomerId, stripeData);
  }

  async select(userAddress: UserAddress, user: User): Promise<UserAddress> {
    switch (userAddress.type) {
      case 'PICKUP':
        userAddress.user.addresses.map(async (address) => {
          if (address.id !== userAddress.id) {
            address.isSelectedPickup = false;
            await this.userAddressRepository.update(address.id, {
              isSelectedPickup: false,
            });
          }

          return address;
        });

        userAddress.isSelectedPickup = true;
        userAddress.isSelectedDelivery = false;

        break;

      case 'DELIVERY':
        userAddress.user.addresses.map(async (address) => {
          if (address.id !== userAddress.id) {
            address.isSelectedDelivery = false;
            await this.userAddressRepository.update(address.id, {
              isSelectedDelivery: false,
            });
          }

          return address;
        });

        userAddress.isSelectedPickup = false;
        userAddress.isSelectedDelivery = true;

        break;

      case 'PICKUP_AND_DELIVERY':
        userAddress.user.addresses.map(async (address) => {
          if (address.id !== userAddress.id) {
            address.isSelectedPickup = false;
            address.isSelectedDelivery = false;
            await this.userAddressRepository.update(address.id, {
              isSelectedPickup: false,
              isSelectedDelivery: false,
            });
          }

          return address;
        });

        userAddress.isSelectedPickup = true;
        userAddress.isSelectedDelivery = true;

        break;

      default:
        throw new Error(`Invalid address type: ${userAddress.type}`);
    }

    // save does not trigger validation, so need to do it manually
    await validateEntity(userAddress);
    const updatedAddress = await this.userAddressRepository.save(userAddress);

    await this.updateStripeCustomerAddress(updatedAddress, user);

    return updatedAddress;
  }

  async create(
    userAddressInput: AddUserAddressInput,
    user: User,
  ): Promise<UserAddress> {
    const preparedUserAddress = this.userAddressRepository.create({
      ...userAddressInput,
      user,
    });

    return this.select(preparedUserAddress, user);
  }

  async update(
    id: string,
    userAddressData: UpdateUserAddressInput,
    user: User,
  ): Promise<UserAddress> {
    const userAddress = await this.findOne(id, user, 'update');

    // save does not trigger validation, so need to do it manually
    for (const [key, value] of Object.entries(userAddressData)) {
      userAddress[key] = value;
    }

    return this.select(userAddress, user);
  }

  async remove(id: string, user: User): Promise<UserAddress> {
    const userAddress = await this.findOne(id, user, 'remove');

    return await this.userAddressRepository.remove(userAddress);
  }

  async findSelectedAddresses(
    user: User,
  ): Promise<{ pickup: UserAddress; delivery: UserAddress }> {
    // pickup address
    const selectedPickupAddress = await this.userAddressRepository.findOne({
      where: {
        user,
        isSelectedPickup: true,
      },
    });

    if (!selectedPickupAddress) {
      throw new Error('No pickup address selected');
    }

    // delivery address
    let selectedDeliveryAddress: UserAddress;
    if (selectedPickupAddress.isSelectedDelivery) {
      selectedDeliveryAddress = selectedPickupAddress;
    } else {
      selectedDeliveryAddress = await this.userAddressRepository.findOne({
        where: {
          user,
          isSelectedDelivery: true,
        },
      });
    }

    if (!selectedDeliveryAddress) {
      throw new Error('No delivery address selected');
    }

    return {
      pickup: selectedPickupAddress,
      delivery: selectedDeliveryAddress,
    };
  }
}
