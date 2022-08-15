import { StripeModule } from '@golevelup/nestjs-stripe';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { socialProfileFactory } from 'test/factories/auth.factory';
import {
  registerUserInputFactory,
  stripeCustomerFactory,
  userFactory,
} from 'test/factories/user.factory';
import { PaymentService } from '../../payments/payment.service';
import { UserRepository } from '../user.repository';
import { UserService } from '../user.service';
import stripeConfig from 'src/server/config/stripe.config';
import { OrderRepository } from '../../orders/order.repository';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
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
      providers: [UserService, UserRepository, PaymentService, OrderRepository],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    paymentService = module.get<PaymentService>(PaymentService);
  });

  describe('create', () => {
    it('should save user', async () => {
      const userRegisterInput = registerUserInputFactory.buildOne();
      const stripeCustomer = stripeCustomerFactory.buildOne({
        email: userRegisterInput.email,
        name: `${userRegisterInput.firstName} ${userRegisterInput.lastName}`,
        phone: userRegisterInput.phoneNumber,
      });
      const user = userFactory.buildOne({
        ...userRegisterInput,
        stripeCustomerId: stripeCustomer.id,
      });
      jest.spyOn(userRepository, 'create').mockReturnValueOnce(user);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(user);
      jest
        .spyOn(paymentService, 'createCustomer')
        .mockReturnValueOnce(stripeCustomer);

      const result = await userService.create(userRegisterInput);

      expect(result).toBe(user);
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const user = userFactory.buildOne();
      const userData = {
        firstName: 'New',
        lastName: 'Name',
      };
      const updatedUser = userFactory.buildOne({
        ...userData,
        id: user.id,
      });
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(updatedUser);

      const result = await userService.update(user, userData);
      expect(result).toBe(updatedUser);
    });
  });

  describe('findOneByEmail', () => {
    it('should return user with given email', async () => {
      const user = userFactory.buildOne();
      jest
        .spyOn(userRepository, 'findOneAndAllAddressesByEmail')
        .mockResolvedValueOnce(user);

      const result = await userService.findOneByEmail(user.email);

      expect(result).toBe(user);
    });
  });

  describe('findOneBySocialId', () => {
    it('should return user with given social id', async () => {
      const { id: socialId } = socialProfileFactory.buildOne();
      const user = userFactory.buildOne();
      jest
        .spyOn(userRepository, 'findOneAndAllAddressesBySocialId')
        .mockResolvedValueOnce(user);

      const result = await userService.findOneBySocialId(socialId);

      expect(result).toBe(user);
    });
  });

  describe('existsByCredentials', () => {
    it('should return if user with given credentials exists', async () => {
      const { email } = userFactory.buildOne();
      jest.spyOn(userRepository, 'existsByEmail').mockResolvedValueOnce(true);

      const result = await userService.existsByCredentials({ email });

      expect(result).toBeTruthy();
    });
  });
});
