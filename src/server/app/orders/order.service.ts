import { Injectable } from '@nestjs/common';
import { validateEntity } from 'src/server/common/utils/validateEntity';
import { getCustomRepository } from 'typeorm';
import { PaymentService } from '../payments/payment.service';
import { ProductFeatureOptionVersionRepository } from '../product_feature_option_versions/product_feature_option_version.repository';
import { ProductVersionRepository } from '../product_versions/product_version.repository';
import { User } from '../users/user.entity';
import { UserAddressService } from '../user_addresses/user_address.service';
import { CreateUnconfirmedOrderInput } from './input/create_unconfirmed_order.input';
import { UpdateOrderDetailsInput } from './input/update_order_details.input';
import { UpdateOrderScheduleInput } from './input/update_order_schedule.input';
import { Order } from './order.entity';
import { OrderRepository } from './order.repository';
import { getOrderAddressInputs } from './utils/getOrderAddressInputs';
import { getTotalOrderPrice } from './utils/getTotalOrderPrice';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly paymentService: PaymentService,
    private readonly userAddressService: UserAddressService,
  ) {}
  async findOne(id: string, userId: string): Promise<Order> {
    const order =
      await this.orderRepository.findOneForUserWithAddressesProductWasherFeaturesAndPrices(
        id,
        userId,
      );

    if (!order) throw new Error(`Order with id ${id} not found`);

    return order;
  }

  findAll(userId: string): Promise<Order[]> {
    return this.orderRepository.findAllForUser(userId);
  }

  async createUnconfirmed(
    input: CreateUnconfirmedOrderInput,
    user: User,
  ): Promise<Order> {
    const { productVersionId, preferenceIds, ...rest } = input;

    // validate product version
    const productVersionRepository = getCustomRepository(
      ProductVersionRepository,
    );
    const productVersion = await productVersionRepository.findOneWithPrices(
      productVersionId,
    );
    if (!productVersion) {
      throw new Error(`Product version with id ${productVersionId} not found`);
    }

    // validate preferences
    const optionVersionRepository = getCustomRepository(
      ProductFeatureOptionVersionRepository,
    );
    const preferences = await optionVersionRepository.findAllWithPrices(
      preferenceIds,
    );
    if (preferences.length !== preferenceIds.length) {
      throw new Error('One or more preferences do not exist');
    }

    const totalPriceInCents = getTotalOrderPrice({
      productVersion,
      preferences,
      currencyCode: user.currencyCode,
      isExpressDelivery: rest.isExpressDelivery,
      quantity: rest.quantity,
    });

    // order
    const { pickup, delivery } =
      await this.userAddressService.findSelectedAddresses(user);
    const { pickupAddressInput, deliveryAddressInput } = getOrderAddressInputs(
      pickup,
      delivery,
    );
    const preparedOrder = this.orderRepository.create({
      ...rest,
      user,
      totalPriceInCents,
      currencyCode: user.currencyCode,
      status: 'NOT_CONFIRMED',
      pickupAddress: pickupAddressInput,
      deliveryAddress: deliveryAddressInput,
      productVersion: { id: productVersionId },
      preferences: preferenceIds.map((id) => ({ id })),
    });

    return this.orderRepository.save(preparedOrder);
  }

  async confirm(id: string, user: User): Promise<Order> {
    const order = await this.orderRepository.findOneOrError(id);

    if (order.user.id !== user.id) {
      throw new Error(
        'Unauthorized: Only the owner of this order can confirm it',
      );
    }

    if (order.status !== 'NOT_CONFIRMED') {
      throw new Error('Order is already confirmed');
    }

    // save does not trigger validation, so we need to do it manually
    order.status = 'CONFIRMED';
    await validateEntity(order);

    return this.orderRepository.save(order);
  }

  async remove(id: string, user: User): Promise<Order> {
    const order = await this.orderRepository.findOneOrError(id);

    if (order.user.id !== user.id) {
      throw new Error(
        'Unauthorized: Only the owner of this order can remove it',
      );
    }

    if (order.status !== 'NOT_CONFIRMED') {
      throw new Error('Order is already confirmed and cannot be removed');
    }

    // cancel stripe payment intent
    this.paymentService.cancelPaymentIntent(order.stripePaymentIntentId);

    return this.orderRepository.remove(order);
  }

  async updateDetails(
    id: string,
    input: UpdateOrderDetailsInput,
    user: User,
  ): Promise<Order> {
    const order = await this.orderRepository.findOneOrError(id);

    if (order.user.id !== user.id) {
      throw new Error(
        'Unauthorized: Only the owner of this order can update its details',
      );
    }

    if (order.status !== 'NOT_CONFIRMED') {
      throw new Error(
        'Order is already confirmed and its details cannot be updated',
      );
    }

    // determine which preferences to remove and which to add
    const { preferenceIds, ...rest } = input;
    const existingOrderPreferenceIds = order.preferences.map(
      (preference) => preference.id,
    );
    const preferencesToRemove = existingOrderPreferenceIds.filter(
      (id) => !preferenceIds.includes(id),
    );
    const preferencesToAdd = preferenceIds.filter(
      (id) => !existingOrderPreferenceIds.includes(id),
    );

    // update preferences
    await this.orderRepository.addAndRemovePreferences(
      order,
      preferencesToAdd,
      preferencesToRemove,
    );

    // save does not trigger validation, so need to do it manually
    for (const [key, value] of Object.entries(rest)) {
      order[key] = value;
    }
    await validateEntity(order);

    return this.orderRepository.save({ ...rest, id });
  }

  async updateSchedule(
    id: string,
    input: UpdateOrderScheduleInput,
    user: User,
  ): Promise<Order> {
    const order = await this.orderRepository.findOneOrError(id);

    if (order.user.id !== user.id) {
      throw new Error(
        'Unauthorized: Only the owner of this order can update its schedule',
      );
    }

    if (order.status !== 'NOT_CONFIRMED') {
      throw new Error(
        'Order is already confirmed and its schedule cannot be updated',
      );
    }

    // save does not trigger validation, so need to do it manually
    for (const [key, value] of Object.entries(input)) {
      order[key] = value;
    }
    await validateEntity(order);

    return this.orderRepository.save(order);
  }

  async updateAddresses(id: string, user: User): Promise<Order> {
    const order = await this.orderRepository.findOneOrError(id);

    if (order.user.id !== user.id) {
      throw new Error(
        'Unauthorized: Only the owner of this order can update its addresses',
      );
    }

    if (order.status !== 'NOT_CONFIRMED') {
      throw new Error(
        'Order is already confirmed and its addresses cannot be updated',
      );
    }

    const { pickup, delivery } =
      await this.userAddressService.findSelectedAddresses(user);
    const { pickupAddressInput, deliveryAddressInput } = getOrderAddressInputs(
      pickup,
      delivery,
    );
    return this.orderRepository.updateAddresses(
      order,
      pickupAddressInput,
      deliveryAddressInput,
    );
  }

  update(orderId: string, orderData: Partial<Order>): Promise<Order> {
    return this.orderRepository.save({ ...orderData, id: orderId });
  }
}
