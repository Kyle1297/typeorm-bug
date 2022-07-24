import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateUnconfirmedOrderInputFactory,
  orderFactory,
  UpdateOrderAddressesInputFactory,
  UpdateOrderDetailsInputFactory,
  UpdateOrderScheduleInputFactory,
} from 'test/factories/order.factory';
import { OrderRepository } from '../order.repository';
import { OrderResolver } from '../order.resolver';
import { OrderService } from '../order.service';
import * as faker from 'faker';
import { userFactory } from 'test/factories/user.factory';
import { washerFactory } from 'test/factories/washer.factory';
import {
  productFactory,
  productVersionFactory,
} from 'test/factories/product.factory';
import {
  productFeatureOptionPriceFactory,
  productPriceFactory,
} from 'test/factories/price.factory';
import { productFeatureFactory } from 'test/factories/product_feature.factory';
import {
  productFeatureOptionFactory,
  productFeatureOptionVersionFactory,
} from 'test/factories/product_feature_option.factory';
import { orderImageFactory } from 'test/factories/image.factory';
import { orderAddressFactory } from 'test/factories/address.factory';
import { orderTimeslots } from '../scalars/order_timeslot.scalar';
import { orderStatuses } from '../scalars/order_status.scalar';

describe('OrderResolver', () => {
  let resolver: OrderResolver;
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderResolver, OrderService, OrderRepository],
    }).compile();

    resolver = module.get<OrderResolver>(OrderResolver);
    service = module.get<OrderService>(OrderService);
  });

  describe('orders', () => {
    it('should retrieve current order', async () => {
      const user = userFactory.buildOne();
      const washer = washerFactory.buildOne({
        user,
      });
      const product = productFactory.buildOne({
        versions: [
          productVersionFactory.buildOne({
            basePrice: productPriceFactory.buildOne(),
            expressDeliveryPrice: productPriceFactory.buildOne(),
          }),
        ],
        features: [
          productFeatureFactory.buildOne({
            options: [
              productFeatureOptionFactory.buildOne({
                versions: [
                  productFeatureOptionVersionFactory.buildOne({
                    price: productFeatureOptionPriceFactory.buildOne(),
                  }),
                ],
              }),
            ],
          }),
        ],
      });
      const orderOne = orderFactory.buildOne({
        user,
        washer,
        productVersion: product.versions[0],
        preferences: product.features[0].options[0].versions,
      });
      const orderTwo = orderFactory.buildOne({
        user,
        washer,
        productVersion: product.versions[0],
        preferences: product.features[0].options[0].versions,
        id: faker.datatype.uuid(),
        orderNumber: faker.datatype.uuid(),
        status: faker.random.arrayElement(orderStatuses),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        pickupDate: faker.date.past(),
        deliveryDate: faker.date.past(),
        pickupAddress: orderAddressFactory.buildOne(),
        deliveryAddress: orderAddressFactory.buildOne(),
        pickupBetween: faker.random.arrayElement(orderTimeslots),
        deliverBetween: faker.random.arrayElement(orderTimeslots),
        currencyCode: faker.finance.currencyCode(),
        totalPriceInCents: faker.datatype.number(),
        quantity: faker.datatype.number(),
        isExpressDelivery: faker.datatype.boolean(),
        confirmedAt: faker.date.past(),
        washerAssignedAt: faker.date.past(),
        pickedUpAt: faker.date.past(),
        readyForDeliveryAt: faker.date.past(),
        deliveredAt: faker.date.past(),
        cancelledAt: faker.date.past(),
        cancellationReason: faker.lorem.sentence(),
        onTheWayAt: faker.date.past(),
        washerNotesOnDelivery: faker.lorem.sentence(),
        washerNotesOnPickup: faker.lorem.sentence(),
        pickupImages: orderImageFactory.buildMany(1),
        deliveryImages: orderImageFactory.buildMany(1),
        readyForDeliveryImages: orderImageFactory.buildMany(1),
        additionalChargeReason: faker.lorem.sentence(),
        additionalChargesInCents: faker.datatype.number(),
      });
      const orders = [orderOne, orderTwo];

      jest.spyOn(service, 'findAll').mockResolvedValueOnce(orders);

      const result = await resolver.orders(user);

      expect(result).toBe(orders);
    });
  });

  describe('order', () => {
    it('should retrieve current order', async () => {
      const user = userFactory.buildOne();
      const washer = washerFactory.buildOne({
        user,
      });
      const product = productFactory.buildOne({
        versions: [
          productVersionFactory.buildOne({
            basePrice: productPriceFactory.buildOne(),
            expressDeliveryPrice: productPriceFactory.buildOne(),
          }),
        ],
        features: [
          productFeatureFactory.buildOne({
            options: [
              productFeatureOptionFactory.buildOne({
                versions: [
                  productFeatureOptionVersionFactory.buildOne({
                    price: productFeatureOptionPriceFactory.buildOne(),
                  }),
                ],
              }),
            ],
          }),
        ],
      });
      const order = orderFactory.buildOne({
        user,
        washer,
        productVersion: product.versions[0],
        preferences: product.features[0].options[0].versions,
      });

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(order);

      const result = await resolver.order(user, order.id);

      expect(result).toBe(order);
    });
  });

  describe('createUnconfirmedOrder', () => {
    it('should create unconfirmed order', async () => {
      const user = userFactory.buildOne();
      const product = productFactory.buildOne({
        versions: [
          productVersionFactory.buildOne({
            basePrice: productPriceFactory.buildOne(),
            expressDeliveryPrice: productPriceFactory.buildOne(),
          }),
        ],
        features: [
          productFeatureFactory.buildOne({
            options: [
              productFeatureOptionFactory.buildOne({
                versions: [
                  productFeatureOptionVersionFactory.buildOne({
                    price: productFeatureOptionPriceFactory.buildOne(),
                  }),
                ],
              }),
            ],
          }),
        ],
      });
      const input = CreateUnconfirmedOrderInputFactory.buildOne({
        productVersionId: product.versions[0].id,
        preferenceIds: [product.features[0].options[0].versions[0].id],
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { productVersionId, preferenceIds, ...rest } = input;
      const order = orderFactory.buildOne({
        user,
        ...rest,
        productVersion: product.versions[0],
        preferences: product.features[0].options[0].versions,
        status: 'NOT_CONFIRMED',
      });

      jest.spyOn(service, 'createUnconfirmed').mockResolvedValueOnce(order);

      const result = await resolver.createUnconfirmedOrder(user, input);

      expect(result).toBe(order);
    });
  });

  describe('confirmOrder', () => {
    it('should confirm order', async () => {
      const user = userFactory.buildOne();
      const product = productFactory.buildOne({
        versions: [
          productVersionFactory.buildOne({
            basePrice: productPriceFactory.buildOne(),
            expressDeliveryPrice: productPriceFactory.buildOne(),
          }),
        ],
        features: [
          productFeatureFactory.buildOne({
            options: [
              productFeatureOptionFactory.buildOne({
                versions: [
                  productFeatureOptionVersionFactory.buildOne({
                    price: productFeatureOptionPriceFactory.buildOne(),
                  }),
                ],
              }),
            ],
          }),
        ],
      });
      const order = orderFactory.buildOne({
        user,
        productVersion: product.versions[0],
        preferences: product.features[0].options[0].versions,
        status: 'NOT_CONFIRMED',
      });

      jest.spyOn(service, 'confirm').mockResolvedValueOnce(order);

      const result = await resolver.confirmOrder(user, order.id);

      expect(result).toBe(order);
    });
  });

  describe('updateOrderAddresses', () => {
    it('should update order addresses', async () => {
      const user = userFactory.buildOne();
      const product = productFactory.buildOne({
        versions: [
          productVersionFactory.buildOne({
            basePrice: productPriceFactory.buildOne(),
            expressDeliveryPrice: productPriceFactory.buildOne(),
          }),
        ],
        features: [
          productFeatureFactory.buildOne({
            options: [
              productFeatureOptionFactory.buildOne({
                versions: [
                  productFeatureOptionVersionFactory.buildOne({
                    price: productFeatureOptionPriceFactory.buildOne(),
                  }),
                ],
              }),
            ],
          }),
        ],
      });
      const input = UpdateOrderAddressesInputFactory.buildOne();
      const order = orderFactory.buildOne({
        user,
        productVersion: product.versions[0],
        preferences: product.features[0].options[0].versions,
        status: 'NOT_CONFIRMED',
      });

      jest.spyOn(service, 'updateAddresses').mockResolvedValueOnce(order);

      const result = await resolver.updateOrderAddresses(user, order.id, input);

      expect(result).toBe(order);
    });
  });

  describe('updateOrderSchedule', () => {
    it('should update order schedule', async () => {
      const user = userFactory.buildOne();
      const product = productFactory.buildOne({
        versions: [
          productVersionFactory.buildOne({
            basePrice: productPriceFactory.buildOne(),
            expressDeliveryPrice: productPriceFactory.buildOne(),
          }),
        ],
        features: [
          productFeatureFactory.buildOne({
            options: [
              productFeatureOptionFactory.buildOne({
                versions: [
                  productFeatureOptionVersionFactory.buildOne({
                    price: productFeatureOptionPriceFactory.buildOne(),
                  }),
                ],
              }),
            ],
          }),
        ],
      });
      const input = UpdateOrderScheduleInputFactory.buildOne();
      const order = orderFactory.buildOne({
        user,
        productVersion: product.versions[0],
        preferences: product.features[0].options[0].versions,
        status: 'NOT_CONFIRMED',
      });

      jest.spyOn(service, 'updateSchedule').mockResolvedValueOnce(order);

      const result = await resolver.updateOrderSchedule(user, order.id, input);

      expect(result).toBe(order);
    });
  });

  describe('removeOrder', () => {
    it('should remove order', async () => {
      const user = userFactory.buildOne();
      const product = productFactory.buildOne({
        versions: [
          productVersionFactory.buildOne({
            basePrice: productPriceFactory.buildOne(),
            expressDeliveryPrice: productPriceFactory.buildOne(),
          }),
        ],
        features: [
          productFeatureFactory.buildOne({
            options: [
              productFeatureOptionFactory.buildOne({
                versions: [
                  productFeatureOptionVersionFactory.buildOne({
                    price: productFeatureOptionPriceFactory.buildOne(),
                  }),
                ],
              }),
            ],
          }),
        ],
      });
      const order = orderFactory.buildOne({
        user,
        productVersion: product.versions[0],
        preferences: product.features[0].options[0].versions,
        status: 'NOT_CONFIRMED',
      });

      jest.spyOn(service, 'remove').mockResolvedValueOnce(order);

      const result = await resolver.removeOrder(user, order.id);

      expect(result).toBe(order);
    });
  });

  describe('updateOrderDetails', () => {
    it('should update order details', async () => {
      const user = userFactory.buildOne();
      const product = productFactory.buildOne({
        versions: [
          productVersionFactory.buildOne({
            basePrice: productPriceFactory.buildOne(),
            expressDeliveryPrice: productPriceFactory.buildOne(),
          }),
        ],
        features: [
          productFeatureFactory.buildOne({
            options: [
              productFeatureOptionFactory.buildOne({
                versions: [
                  productFeatureOptionVersionFactory.buildOne({
                    price: productFeatureOptionPriceFactory.buildOne(),
                  }),
                ],
              }),
            ],
          }),
        ],
      });
      const input = UpdateOrderDetailsInputFactory.buildOne({
        preferenceIds: [product.features[0].options[0].versions[0].id],
      });
      const order = orderFactory.buildOne({
        user,
        productVersion: product.versions[0],
        preferences: product.features[0].options[0].versions,
        status: 'NOT_CONFIRMED',
      });

      jest.spyOn(service, 'updateDetails').mockResolvedValueOnce(order);

      const result = await resolver.updateOrderDetails(user, order.id, input);

      expect(result).toBe(order);
    });
  });
});
