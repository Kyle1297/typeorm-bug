import { Test, TestingModule } from '@nestjs/testing';
import {
  addUserAddressInputFactory,
  userAddressFactory,
  updateUserAddressInputFactory,
} from 'test/factories/address.factory';
import {
  stripeCustomerFactory,
  userFactory,
} from 'test/factories/user.factory';
import { UserRepository } from '../../users/user.repository';
import { UserService } from '../../users/user.service';
import { UserAddressRepository } from '../user_address.repository';
import { UserAddressService } from '../user_address.service';
import stripeConfig from 'src/server/config/stripe.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeModule } from '@golevelup/nestjs-stripe';
import { PaymentService } from '../../payments/payment.service';
import { UpdateResult } from 'typeorm';

describe('UserAddressService', () => {
  let service: UserAddressService;
  let userAddressRepository: UserAddressRepository;
  let paymentService: PaymentService;

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
        UserAddressService,
        UserAddressRepository,
        UserService,
        UserRepository,
        PaymentService,
      ],
    }).compile();

    service = module.get<UserAddressService>(UserAddressService);
    userAddressRepository = module.get<UserAddressRepository>(
      UserAddressRepository,
    );
    paymentService = module.get<PaymentService>(PaymentService);
  });

  describe('create', () => {
    it('should save userAddress', async () => {
      const stripeCustomer = stripeCustomerFactory.buildOne();
      const user = userFactory.buildOne({
        email: stripeCustomer.email,
        stripeCustomerId: stripeCustomer.id,
        phoneNumber: stripeCustomer.phone,
      });
      const addUserAddressInput = addUserAddressInputFactory.buildOne({
        type: 'PICKUP_AND_DELIVERY',
      });
      const userAddress = userAddressFactory.buildOne({
        ...addUserAddressInput,
        user,
      });

      jest
        .spyOn(userAddressRepository, 'create')
        .mockReturnValueOnce(userAddress);
      jest
        .spyOn(userAddressRepository, 'save')
        .mockResolvedValueOnce(userAddress);
      jest
        .spyOn(paymentService, 'updateCustomer')
        .mockReturnValueOnce(stripeCustomer);

      const result = await service.create(userAddress, user);

      expect(result).toEqual(userAddress);
    });
  });

  describe('update', () => {
    it('should update userAddress', async () => {
      const stripeCustomer = stripeCustomerFactory.buildOne();
      const user = userFactory.buildOne({
        email: stripeCustomer.email,
        stripeCustomerId: stripeCustomer.id,
        phoneNumber: stripeCustomer.phone,
      });
      const userAddress = userAddressFactory.buildOne({
        user,
      });
      const userAddressData = updateUserAddressInputFactory.buildOne();
      const updatedUserAddress = userAddressFactory.buildOne({
        ...userAddress,
        ...userAddressData,
      });

      jest
        .spyOn(userAddressRepository, 'save')
        .mockResolvedValueOnce(updatedUserAddress);
      jest
        .spyOn(userAddressRepository, 'findOneOrError')
        .mockResolvedValueOnce(userAddress);
      jest
        .spyOn(paymentService, 'updateCustomer')
        .mockReturnValueOnce(stripeCustomer);

      const result = await service.update(
        userAddress.id,
        userAddressData,
        user,
      );
      expect(result).toEqual(updatedUserAddress);
    });
  });

  describe('remove', () => {
    it('should remove userAddress', async () => {
      const user = userFactory.buildOne();
      const userAddress = userAddressFactory.buildOne({
        user,
      });

      jest
        .spyOn(userAddressRepository, 'findOneOrError')
        .mockResolvedValueOnce(userAddress);
      jest
        .spyOn(userAddressRepository, 'remove')
        .mockResolvedValueOnce(userAddress);

      const result = await service.remove(userAddress.id, user);

      expect(result).toEqual(userAddress);
    });
  });

  describe('findOne', () => {
    it('should find userAddress', async () => {
      const user = userFactory.buildOne();
      const userAddress = userAddressFactory.buildOne({
        user,
      });

      jest
        .spyOn(userAddressRepository, 'findOneOrError')
        .mockResolvedValueOnce(userAddress);

      const result = await service.findOne(userAddress.id, user);

      expect(result).toEqual(userAddress);
    });
  });

  describe('updateStripeCustomerAddress', () => {
    it('should update stripe customer address', async () => {
      const stripeCustomer = stripeCustomerFactory.buildOne();
      const user = userFactory.buildOne({
        email: stripeCustomer.email,
        stripeCustomerId: stripeCustomer.id,
        phoneNumber: stripeCustomer.phone,
      });
      const userAddress = userAddressFactory.buildOne({
        user,
      });

      jest
        .spyOn(paymentService, 'updateCustomer')
        .mockReturnValueOnce(stripeCustomer);

      const result = await service.updateStripeCustomerAddress(
        userAddress,
        user,
      );

      expect(result).toBeUndefined();
    });
  });

  describe('select', () => {
    it('should select userAddress', async () => {
      const stripeCustomer = stripeCustomerFactory.buildOne();
      let user = userFactory.buildOne({
        email: stripeCustomer.email,
        stripeCustomerId: stripeCustomer.id,
        phoneNumber: stripeCustomer.phone,
      });
      const prevUserAddress = userAddressFactory.buildOne({
        user,
        type: 'PICKUP_AND_DELIVERY',
        isSelectedDelivery: true,
        isSelectedPickup: true,
      });
      user = userFactory.buildOne({
        ...user,
        addresses: [prevUserAddress],
      });
      const newPrevUserAddress = userAddressFactory.buildOne({
        ...prevUserAddress,
        isSelectedDelivery: false,
        isSelectedPickup: false,
      });
      const userAddress = userAddressFactory.buildOne({
        user,
        type: 'PICKUP_AND_DELIVERY',
        isSelectedDelivery: false,
        isSelectedPickup: false,
      });
      const newUserAddress = userAddressFactory.buildOne({
        ...userAddress,
        isSelectedDelivery: true,
        isSelectedPickup: true,
      });

      jest
        .spyOn(userAddressRepository, 'update')
        .mockResolvedValueOnce(newPrevUserAddress as unknown as UpdateResult);
      jest
        .spyOn(userAddressRepository, 'save')
        .mockResolvedValueOnce(newUserAddress);
      jest
        .spyOn(paymentService, 'updateCustomer')
        .mockReturnValueOnce(stripeCustomer);

      const result = await service.select(userAddress, user);

      expect(result).toEqual(userAddress);
    });
  });

  describe('findSelectedAddresses', () => {
    it('should find selected addresses', async () => {
      const user = userFactory.buildOne();
      const userAddress = userAddressFactory.buildOne({
        user,
        type: 'PICKUP_AND_DELIVERY',
        isSelectedDelivery: true,
        isSelectedPickup: true,
      });

      jest
        .spyOn(userAddressRepository, 'findOne')
        .mockResolvedValueOnce(userAddress);

      const result = await service.findSelectedAddresses(user);

      expect(result).toEqual({
        pickup: userAddress,
        delivery: userAddress,
      });
    });
  });
});
