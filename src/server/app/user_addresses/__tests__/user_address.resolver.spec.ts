import { Test, TestingModule } from '@nestjs/testing';
import { UserAddressResolver } from '../user_address.resolver';
import { UserAddressService } from '../user_address.service';
import { UserAddressRepository } from '../user_address.repository';
import { userFactory } from 'test/factories/user.factory';
import {
  userAddressFactory,
  updateUserAddressInputFactory,
  addUserAddressInputFactory,
} from 'test/factories/address.factory';
import { UserService } from '../../users/user.service';
import { UserRepository } from '../../users/user.repository';
import stripeConfig from 'src/server/config/stripe.config';
import { PaymentService } from '../../payments/payment.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeModule } from '@golevelup/nestjs-stripe';

describe('UserAddressResolver', () => {
  let resolver: UserAddressResolver;
  let service: UserAddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(stripeConfig),
        StripeModule.forRootAsync(StripeModule, {
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            apiKey: configService.get('stripe.apiKey'),
            apiVersion: configService.get('stripe.apiVersion'),
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [
        UserAddressResolver,
        UserAddressService,
        UserAddressRepository,
        UserService,
        UserRepository,
        PaymentService,
      ],
    }).compile();

    resolver = module.get<UserAddressResolver>(UserAddressResolver);
    service = module.get<UserAddressService>(UserAddressService);
  });

  describe('addUserAddress Mutation', () => {
    it('should allow adding userAddress', async () => {
      const user = userFactory.buildOne();
      const addUserAddress = addUserAddressInputFactory.buildOne();
      const userAddress = userAddressFactory.buildOne({
        ...addUserAddress,
        user,
      });

      jest.spyOn(service, 'create').mockResolvedValueOnce(userAddress);

      const result = await resolver.addUserAddress(addUserAddress, user);

      expect(result).toBe(userAddress);
    });
  });

  describe('updateUserAddress Mutation', () => {
    it('should allow updating userAddress', async () => {
      const user = userFactory.buildOne();
      const userAddressInput = updateUserAddressInputFactory.buildOne();
      const userAddress = userAddressFactory.buildOne({
        ...userAddressInput,
        user,
      });

      jest.spyOn(service, 'update').mockResolvedValueOnce(userAddress);

      const result = await resolver.updateUserAddress(
        userAddress.id,
        userAddressInput,
        user,
      );

      expect(result).toBe(userAddress);
    });
  });

  describe('removeUserAddress mutation', () => {
    it('should allow removing user address', async () => {
      const user = userFactory.buildOne();
      const userAddress = userAddressFactory.buildOne({
        user,
      });

      jest.spyOn(service, 'remove').mockResolvedValueOnce(userAddress);

      const result = await resolver.removeUserAddress(userAddress.id, user);

      expect(result).toBe(userAddress);
    });
  });

  describe('selectUserAddress mutation', () => {
    it('should allow selecting user address', async () => {
      const user = userFactory.buildOne();
      const userAddress = userAddressFactory.buildOne({
        user,
        type: 'PICKUP_AND_DELIVERY',
        isSelectedDelivery: false,
        isSelectedPickup: false,
      });
      const updatedAddress = userAddressFactory.buildOne({
        ...userAddress,
        isSelectedDelivery: true,
        isSelectedPickup: true,
      });

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(userAddress);
      jest.spyOn(service, 'select').mockResolvedValueOnce(updatedAddress);

      const result = await resolver.selectUserAddress(userAddress.id, user);

      expect(result).toBe(updatedAddress);
    });
  });
});
