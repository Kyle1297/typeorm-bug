import * as faker from 'faker';
import { FactoryBuilder } from 'factory.io';
import { Order } from 'src/server/app/orders/order.entity';
import { orderTimeslots } from 'src/server/app/orders/scalars/order_timeslot.scalar';
import { addressFactory } from './address.factory';
import { orderStatuses } from 'src/server/app/orders/scalars/order_status.scalar';

export const orderFactory = FactoryBuilder.of(Order)
  .props({
    id: faker.datatype.uuid(),
    orderNumber: faker.datatype.uuid(),
    pickupBetween: faker.random.arrayElement(orderTimeslots),
    deliverBetween: faker.random.arrayElement(orderTimeslots),
    pickupAddress: addressFactory.buildOne(),
    deliveryAddress: addressFactory.buildOne(),
    status: faker.random.arrayElement(orderStatuses),
    currencyCode: faker.finance.currencyCode(),
    washer: null,
    product: null,
    user: null,
    confirmedAt: faker.date.recent(),
    washerAssignedAt: faker.date.recent(),
    pickedUpAt: faker.date.recent(),
    readyForDeliveryAt: faker.date.recent(),
    onTheWayAt: faker.date.recent(),
    deliveredAt: faker.date.recent(),
    notesOnPickup: faker.lorem.sentence(),
    notesOnDelivery: faker.lorem.sentence(),
    pickupImages: [],
    deliveryImages: [],
    readyForDeliveryImages: [],
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  })
  .build();
