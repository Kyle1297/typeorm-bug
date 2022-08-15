import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestUtils } from './typeorm_test.utils';
import { GraphqlTestConfigService } from '../../config/graphql.config';
import { TypeOrmTestConfigService } from '../../config/typeorm.config';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/server/app/app.module';
import { GraphqlConfigService } from 'src/server/config/graphql.config';
import { TypeOrmConfigService } from 'src/server/config/typeorm.config';
import { PaymentService } from 'src/server/app/payments/payment.service';

export interface E2EApp {
  app: INestApplication;
  dbTestUtils: TypeOrmTestUtils;
  cleanup: () => void;
}

export async function initializeApp() {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule, TypeOrmTestUtils],
  })
    .overrideProvider(GraphqlConfigService)
    .useClass(GraphqlTestConfigService)
    .overrideProvider(TypeOrmConfigService)
    .useClass(TypeOrmTestConfigService)
    .overrideProvider(PaymentService)
    .useValue({
      updateCustomer: async () => ({
        id: 'cus_Foo',
        email: 'test@test.com',
        name: 'Test',
        phone: '1234567890',
      }),
      createCustomer: async () => ({
        id: 'cus_Foo',
        email: 'test@test.com',
        name: 'Test',
        phone: '1234567890',
      }),
      createEphemeralKey: async () => ({
        id: 'eph_Foo',
        object: 'ephemeral_key',
        customer: 'cus_Foo',
        usage: 'off_session',
      }),
      createPaymentIntent: async () => ({
        id: 'pi_Foo',
        object: 'payment_intent',
        amount: 1000,
        currency: 'aud',
        customer: 'cus_Foo',
        setup_future_usage: 'on_session',
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          orderId: 'order_Foo',
          userId: 'user_Foo',
        },
      }),
      cancelPaymentIntent: async () => ({
        id: 'pi_Foo',
        object: 'payment_intent',
        amount: 1000,
        currency: 'aud',
        customer: 'cus_Foo',
        setup_future_usage: 'on_session',
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          orderId: 'order_Foo',
          userId: 'user_Foo',
        },
      }),
      createSetupIntent: async () => ({
        id: 'si_Foo',
        object: 'setup_intent',
        customer: 'cus_Foo',
      }),
      retrieveAllPaymentMethods: async () => [
        {
          id: 'pm_Foo',
          object: 'payment_method',
          type: 'card',
          card: {
            brand: 'visa',
            last4: '4242',
            exp_month: 1,
            exp_year: 2020,
          },
        },
      ],
    })
    .compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  const dbTestUtils = app.get(TypeOrmTestUtils);
  await dbTestUtils.startServer();

  const cleanup = async () => {
    await dbTestUtils.closeServer();
    await app.close();
  };

  return { app, dbTestUtils, cleanup };
}
