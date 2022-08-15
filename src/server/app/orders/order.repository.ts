import { EntityRepository, Repository } from 'typeorm';
import { UpdateOrderAddressInput } from '../order_addresses/input/update_order_address.input';
import { OrderAddressRepository } from '../order_addresses/order_address.repository';
import { Order } from './order.entity';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order | undefined> {
  findOneForUserWithAddressesProductWasherFeaturesAndPrices(
    id: string,
    userId: string,
  ): Promise<Order> {
    return this.createQueryBuilder('order')
      .leftJoinAndSelect('order.washer', 'washer')
      .leftJoinAndSelect('washer.user', 'washerUser')
      .leftJoinAndSelect('order.pickupAddress', 'pickupAddress')
      .leftJoinAndSelect('order.deliveryAddress', 'deliveryAddress')
      .leftJoinAndSelect('order.images', 'orderImage')
      .leftJoinAndSelect('order.productVersion', 'productVersion')
      .leftJoinAndSelect('productVersion.product', 'product')
      .leftJoinAndSelect(
        'productVersion.basePrice',
        'basePrice',
        'basePrice.id = productVersion.basePriceId',
      )
      .leftJoinAndSelect(
        'productVersion.expressDeliveryPrice',
        'expressDeliveryPrice',
        'expressDeliveryPrice.id = productVersion.expressDeliveryPriceId',
      )
      .leftJoinAndSelect('order.preferences', 'productFeatureOptionVersion')
      .leftJoinAndSelect(
        'productFeatureOptionVersion.price',
        'optionPrice',
        'optionPrice.id = productFeatureOptionVersion.priceId',
      )
      .leftJoinAndSelect(
        'productFeatureOptionVersion.productFeatureOption',
        'productFeatureOption',
      )
      .leftJoinAndSelect(
        'productFeatureOption.productFeature',
        'productFeature',
      )
      .where('order.id = :id', { id })
      .andWhere('order.userId = :userId', { userId })
      .getOne();
  }

  findOneWithAllPrices(id: string, userId: string): Promise<Order> {
    return this.createQueryBuilder('order')
      .leftJoinAndSelect('order.productVersion', 'productVersion')
      .leftJoinAndSelect(
        'productVersion.basePrice',
        'basePrice',
        'basePrice.id = productVersion.basePriceId',
      )
      .leftJoinAndSelect(
        'productVersion.expressDeliveryPrice',
        'expressDeliveryPrice',
        'expressDeliveryPrice.id = productVersion.expressDeliveryPriceId',
      )
      .leftJoinAndSelect('order.preferences', 'productFeatureOptionVersion')
      .leftJoinAndSelect(
        'productFeatureOptionVersion.price',
        'optionPrice',
        'optionPrice.id = productFeatureOptionVersion.priceId',
      )
      .where('order.id = :id', { id })
      .andWhere('order.userId = :userId', { userId })
      .getOne();
  }

  async findAllForUser(userId: string): Promise<Order[]> {
    return this.createQueryBuilder('order')
      .where('order.userId = :userId', { userId })
      .getMany();
  }

  async findOneOrError(id: string): Promise<Order> {
    const order = await this.findOne(id, {
      relations: ['user'],
    });

    if (!order) {
      throw new Error(`Order with id ${id} not found`);
    }

    return order;
  }

  async addAndRemovePreferences(
    order: Order,
    preferencesToAdd: string[],
    preferencesToRemove: string[],
  ) {
    await this.createQueryBuilder()
      .relation(Order, 'preferences')
      .of(order)
      .addAndRemove(preferencesToAdd, preferencesToRemove);
  }

  async updateAddresses(
    order: Order,
    pickupAddressInput: UpdateOrderAddressInput,
    deliveryAddressInput: UpdateOrderAddressInput,
  ): Promise<Order> {
    return this.manager.transaction(async (transactionalManager) => {
      const orderAddressRepository = transactionalManager.getCustomRepository(
        OrderAddressRepository,
      );

      const pickupAddress = await orderAddressRepository.updateOne(
        order.pickupAddress.id,
        pickupAddressInput,
      );

      const deliveryAddress = await orderAddressRepository.updateOne(
        order.deliveryAddress.id,
        deliveryAddressInput,
      );

      await transactionalManager
        .createQueryBuilder()
        .relation(Order, 'pickupAddress')
        .of(order)
        .set(pickupAddress);

      await transactionalManager
        .createQueryBuilder()
        .relation(Order, 'deliveryAddress')
        .of(order)
        .set(deliveryAddress);

      order.pickupAddress = pickupAddress;
      order.deliveryAddress = deliveryAddress;

      return order;
    });
  }
}
