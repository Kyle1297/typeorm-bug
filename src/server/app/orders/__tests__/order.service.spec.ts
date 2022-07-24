import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateUnconfirmedOrderInputFactory,
  orderFactory,
  UpdateOrderAddressesInputFactory,
  UpdateOrderDetailsInputFactory,
  UpdateOrderScheduleInputFactory,
} from 'test/factories/order.factory';
import * as faker from 'faker';
import {
  productFeatureOptionPriceFactory,
  productPriceFactory,
} from 'test/factories/price.factory';
import {
  productFactory,
  productVersionFactory,
} from 'test/factories/product.factory';
import { productFeatureFactory } from 'test/factories/product_feature.factory';
import {
  productFeatureOptionFactory,
  productFeatureOptionVersionFactory,
} from 'test/factories/product_feature_option.factory';
import { userFactory } from 'test/factories/user.factory';
import { washerFactory } from 'test/factories/washer.factory';
import { OrderRepository } from '../order.repository';
import { OrderService } from '../order.service';
import { orderStatuses } from '../scalars/order_status.scalar';
import { orderAddressFactory } from 'test/factories/address.factory';
import { orderImageFactory } from 'test/factories/image.factory';
import { orderTimeslots } from '../scalars/order_timeslot.scalar';

describe('OrderService', () => {
  let orderService: OrderService;
  let orderRepository: OrderRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderService, OrderRepository],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    orderRepository = module.get<OrderRepository>(OrderRepository);
  });

  describe('findOne', () => {
    it('should return order with given id', async () => {
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

      jest
        .spyOn(
          orderRepository,
          'findOneForUserWithAddressesProductWasherFeaturesAndPrices',
        )
        .mockResolvedValueOnce(order);

      const result = await orderService.findOne(order.id, user.id);

      expect(result).toBe(order);
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
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

      jest
        .spyOn(orderRepository, 'findAllForUser')
        .mockResolvedValueOnce(orders);

      const result = await orderService.findAll(user.id);

      expect(result).toEqual(orders);
    });
  });

  describe('createUnconfirmed', () => {
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

      jest.spyOn(orderRepository, 'create').mockReturnValueOnce(order);
      jest.spyOn(orderRepository, 'save').mockResolvedValueOnce(order);

      const result = await orderService.createUnconfirmed(input, user);

      expect(result).toBe(order);
    });
  });

  describe('confirm', () => {
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

      jest
        .spyOn(orderRepository, 'findOneOrError')
        .mockResolvedValueOnce(order);
      jest.spyOn(orderRepository, 'save').mockResolvedValueOnce(order);

      const result = await orderService.confirm(order.id, user);

      expect(result).toBe(order);
    });
  });

  describe('remove', () => {
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

      jest
        .spyOn(orderRepository, 'findOneOrError')
        .mockResolvedValueOnce(order);
      jest.spyOn(orderRepository, 'remove').mockResolvedValueOnce(order);

      const result = await orderService.remove(order.id, user);

      expect(result).toBe(order);
    });
  });

  describe('updateDetails', () => {
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

      jest
        .spyOn(orderRepository, 'findOneOrError')
        .mockResolvedValueOnce(order);
      jest
        .spyOn(orderRepository, 'addAndRemovePreferences')
        .mockResolvedValueOnce(undefined);
      jest.spyOn(orderRepository, 'save').mockResolvedValueOnce(order);

      const result = await orderService.updateDetails(order.id, input, user);

      expect(result).toBe(order);
    });
  });

  describe('updateSchedule', () => {
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

      jest
        .spyOn(orderRepository, 'findOneOrError')
        .mockResolvedValueOnce(order);
      jest.spyOn(orderRepository, 'save').mockResolvedValueOnce(order);

      const result = await orderService.updateSchedule(order.id, input, user);

      expect(result).toBe(order);
    });
  });

  describe('updateAddresses', () => {
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

      jest
        .spyOn(orderRepository, 'findOneOrError')
        .mockResolvedValueOnce(order);
      jest
        .spyOn(orderRepository, 'updateAddresses')
        .mockResolvedValueOnce(order);

      const result = await orderService.updateAddresses(order.id, input, user);

      expect(result).toBe(order);
    });
  });
});
