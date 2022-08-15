import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  stripeCustomerFactory,
  userFactory,
} from 'test/factories/user.factory';
import { PaymentService } from '../../payments/payment.service';
import { UserRepository } from '../user.repository';
import { UserResolver } from '../user.resolver';
import { UserService } from '../user.service';
import stripeConfig from 'src/server/config/stripe.config';
import { StripeModule } from '@golevelup/nestjs-stripe';
import { OrderRepository } from '../../orders/order.repository';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let service: UserService;
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
        UserResolver,
        UserService,
        UserRepository,
        PaymentService,
        OrderRepository,
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    service = module.get<UserService>(UserService);
    paymentService = module.get<PaymentService>(PaymentService);
  });

  describe('user', () => {
    it('should retrieve current user', async () => {
      const expected = userFactory.buildOne();
      const result = await resolver.user(expected);

      expect(result).toBe(expected);
    });
  });

  describe('updateUserName', () => {
    it('should update current user name', async () => {
      const user = userFactory.buildOne();
      const updatedUser = userFactory.buildOne({
        ...user,
        firstName: 'John',
        lastName: 'Doe',
      });
      const stripeCustomer = stripeCustomerFactory.buildOne({
        email: updatedUser.email,
        name: `${updatedUser.firstName} ${updatedUser.lastName}`,
        phone: updatedUser.phoneNumber,
      });

      jest.spyOn(service, 'update').mockResolvedValueOnce(updatedUser);
      jest
        .spyOn(paymentService, 'updateCustomer')
        .mockResolvedValueOnce(stripeCustomer);

      const result = await resolver.updateUserName(user, {
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(result).toBe(updatedUser);
    });
  });

  describe('updateUserPhone', () => {
    it('should update current user phone', async () => {
      const user = userFactory.buildOne();
      const updatedUser = userFactory.buildOne({
        ...user,
        phoneCountryCode: '+1',
        phoneNumber: '555-555-5555',
      });
      const stripeCustomer = stripeCustomerFactory.buildOne({
        email: updatedUser.email,
        name: `${updatedUser.firstName} ${updatedUser.lastName}`,
        phone: updatedUser.phoneNumber,
      });

      jest.spyOn(service, 'update').mockResolvedValueOnce(updatedUser);
      jest
        .spyOn(paymentService, 'updateCustomer')
        .mockResolvedValueOnce(stripeCustomer);

      const result = await resolver.updateUserPhone(user, {
        phoneCountryCode: '+1',
        phoneNumber: '555-555-5555',
      });

      expect(result).toBe(updatedUser);
    });
  });

  describe('userExists', () => {
    it('should return true if user exists', async () => {
      const user = userFactory.buildOne();
      jest.spyOn(service, 'existsByCredentials').mockResolvedValueOnce(true);

      const result = await resolver.userExists(user.email);

      expect(result).toBe(true);
    });

    it('should return false if user does not exist', async () => {
      jest.spyOn(service, 'existsByCredentials').mockResolvedValueOnce(false);

      const result = await resolver.userExists('fake');

      expect(result).toBe(false);
    });
  });
});
