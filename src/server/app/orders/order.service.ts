import { Injectable } from '@nestjs/common';
import validateEntity from 'src/server/common/utils/validateEntity';
import { User } from '../users/user.entity';
import { CreateUnconfirmedOrderInput } from './input/create_unconfirmed_order.input';
import { UpdateOrderAddressesInput } from './input/update_order_addresses.input';
import { UpdateOrderDetailsInput } from './input/update_order_details.input';
import { UpdateOrderScheduleInput } from './input/update_order_schedule.input';
import { Order } from './order.entity';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}
  findOne(id: string, userId: string): Promise<Order> {
    return this.orderRepository.findOneForUserWithAddressesProductWasherFeaturesAndPrices(
      id,
      userId,
    );
  }

  findAll(userId: string): Promise<Order[]> {
    return this.orderRepository.findAllForUser(userId);
  }

  createUnconfirmed(
    input: CreateUnconfirmedOrderInput,
    user: User,
  ): Promise<Order> {
    const {
      pickupAddressInput,
      deliveryAddressInput,
      productVersionId,
      preferenceIds,
      ...rest
    } = input;

    const preparedOrder = this.orderRepository.create({
      ...rest,
      user,
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

  async updateAddresses(
    id: string,
    input: UpdateOrderAddressesInput,
    user: User,
  ): Promise<Order> {
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

    const { pickupAddressInput, deliveryAddressInput } = input;

    return await this.orderRepository.updateAddresses(
      order,
      pickupAddressInput,
      deliveryAddressInput,
    );
  }
}
