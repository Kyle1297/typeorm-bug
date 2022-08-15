import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';

@Injectable()
export class PaymentService {
  constructor(@InjectStripeClient() private readonly stripe: Stripe) {}

  createCustomer(
    user: Partial<User>,
  ): Promise<Stripe.Response<Stripe.Customer>> {
    return this.stripe.customers.create({
      email: user.email,
      name: user.fullName,
      phone: user.phoneNumber,
    });
  }

  updateCustomer(
    customerId: string,
    customerData: Partial<Stripe.CustomerUpdateParams>,
  ): Promise<Stripe.Response<Stripe.Customer>> {
    return this.stripe.customers.update(customerId, customerData);
  }

  createEphemeralKey(
    customerId: string,
  ): Promise<Stripe.Response<Stripe.EphemeralKey>> {
    return this.stripe.ephemeralKeys.create(
      {
        customer: customerId,
      },
      {
        apiVersion: '2020-08-27',
      },
    );
  }

  createPaymentIntent(
    order: Order,
    user: User,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return this.stripe.paymentIntents.create({
      amount: order.totalPriceInCents,
      currency: order.currencyCode.toLowerCase(),
      customer: user.stripeCustomerId,
      setup_future_usage: 'on_session',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: order.id,
        userId: user.id,
      },
    });
  }

  cancelPaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return this.stripe.paymentIntents.cancel(paymentIntentId);
  }

  createSetupIntent(user: User): Promise<Stripe.Response<Stripe.SetupIntent>> {
    return this.stripe.setupIntents.create({
      customer: user.stripeCustomerId,
    });
  }

  retrieveAllPaymentMethods(
    user: User,
  ): Stripe.ApiListPromise<Stripe.PaymentMethod> {
    return this.stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: 'card',
    });
  }
}
