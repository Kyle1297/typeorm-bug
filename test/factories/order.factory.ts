import * as faker from 'faker';
import { FactoryBuilder } from 'factory.io';
import { Order } from 'src/server/app/orders/order.entity';
import { orderTimeslots } from 'src/server/app/orders/scalars/order_timeslot.scalar';
import { orderStatuses } from 'src/server/app/orders/scalars/order_status.scalar';
import {
  orderAddressFactory,
  updateOrderAddressInputFactory,
} from './address.factory';
import { CreateUnconfirmedOrderInput } from 'src/server/app/orders/input/create_unconfirmed_order.input';
import { UpdateOrderAddressesInput } from 'src/server/app/orders/input/update_order_addresses.input';
import { UpdateOrderDetailsInput } from 'src/server/app/orders/input/update_order_details.input';
import { UpdateOrderScheduleInput } from 'src/server/app/orders/input/update_order_schedule.input';
import { orderImageFactory } from './image.factory';

export const orderFactory = FactoryBuilder.of(Order)
  .props({
    id: faker.datatype.uuid(),
    orderNumber: faker.datatype.uuid(),
    pickupDate: faker.date.future(),
    deliveryDate: faker.date.future(),
    pickupBetween: faker.random.arrayElement(orderTimeslots),
    deliverBetween: faker.random.arrayElement(orderTimeslots),
    pickupAddress: orderAddressFactory.buildOne(),
    deliveryAddress: orderAddressFactory.buildOne(),
    status: faker.random.arrayElement(orderStatuses),
    currencyCode: faker.finance.currencyCode(),
    totalPriceInCents: faker.datatype.number(),
    quantity: faker.datatype.number(),
    isExpressDelivery: faker.datatype.boolean(),
    washer: null,
    productVersion: null,
    user: null,
    confirmedAt: faker.date.recent(),
    washerAssignedAt: faker.date.recent(),
    pickedUpAt: faker.date.recent(),
    readyForDeliveryAt: faker.date.recent(),
    onTheWayAt: faker.date.recent(),
    deliveredAt: faker.date.recent(),
    washerNotesOnPickup: faker.lorem.sentence(),
    washerNotesOnDelivery: faker.lorem.sentence(),
    pickupImages: orderImageFactory.buildMany(1),
    deliveryImages: orderImageFactory.buildMany(1),
    readyForDeliveryImages: orderImageFactory.buildMany(1),
    preferences: [],
    additionalChargesInCents: faker.datatype.number(),
    additionalChargeReason: faker.lorem.sentence(),
    isCancelled: faker.datatype.boolean(),
    cancelledAt: faker.date.recent(),
    cancellationReason: faker.lorem.sentence(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })
  .build();

export const CreateUnconfirmedOrderInputFactory = FactoryBuilder.of(
  CreateUnconfirmedOrderInput,
)
  .props({
    currencyCode: faker.finance.currencyCode(),
    pickupDate: faker.date.future(),
    deliveryDate: faker.date.future(),
    pickupBetween: faker.random.arrayElement(orderTimeslots),
    deliverBetween: faker.random.arrayElement(orderTimeslots),
    pickupAddressInput: orderAddressFactory.buildOne(),
    deliveryAddressInput: orderAddressFactory.buildOne(),
    productVersionId: faker.datatype.uuid(),
    quantity: faker.datatype.number(),
    totalPriceInCents: faker.datatype.number(),
    preferenceIds: [faker.datatype.uuid(), faker.datatype.uuid()],
    isExpressDelivery: faker.datatype.boolean(),
  })
  .build();

export const UpdateOrderAddressesInputFactory = FactoryBuilder.of(
  UpdateOrderAddressesInput,
)
  .props({
    pickupAddressInput: updateOrderAddressInputFactory.buildOne(),
    deliveryAddressInput: updateOrderAddressInputFactory.buildOne(),
  })
  .build();

export const UpdateOrderDetailsInputFactory = FactoryBuilder.of(
  UpdateOrderDetailsInput,
)
  .props({
    preferenceIds: [faker.datatype.uuid(), faker.datatype.uuid()],
    quantity: faker.datatype.number(),
  })
  .build();

export const UpdateOrderScheduleInputFactory = FactoryBuilder.of(
  UpdateOrderScheduleInput,
)
  .props({
    pickupDate: faker.date.future(),
    deliveryDate: faker.date.future(),
    pickupBetween: faker.random.arrayElement(orderTimeslots),
    deliverBetween: faker.random.arrayElement(orderTimeslots),
  })
  .build();
