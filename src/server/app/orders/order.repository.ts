import { EntityRepository, Repository } from 'typeorm';
import { UpdateOrderAddressInput } from '../order_addresses/input/update_order_address.input';
import { OrderAddressService } from '../order_addresses/order_address.service';
import { Order } from './order.entity';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
  constructor(private readonly orderAddressService: OrderAddressService) {
    super();
  }

  findOneForUserWithAddressesProductWasherFeaturesAndPrices(
    id: string,
    userId: string,
  ): Promise<Order> {
    return this.createQueryBuilder('order')
      .leftJoinAndSelect('order.washer', 'washer')
      .leftJoinAndSelect('order.pickupAddress', 'pickupAddress')
      .leftJoinAndSelect('order.deliveryAddress', 'deliveryAddress')
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
      const pickupAddress = await this.orderAddressService.update(
        order.pickupAddress.id,
        pickupAddressInput,
      );

      const deliveryAddress = await this.orderAddressService.update(
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
