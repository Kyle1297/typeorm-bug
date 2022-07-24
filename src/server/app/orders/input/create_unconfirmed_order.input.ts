import { Field, InputType } from '@nestjs/graphql';
import { IsDate, Min } from 'class-validator';
import { IsISO4217 } from 'src/server/common/decorators/IsISO4217';
import { AddOrderAddressInput } from '../../order_addresses/input/add_order_address.input';
import { Order } from '../order.entity';
import {
  OrderTimeslots,
  OrderTimeslotScalar,
} from '../scalars/order_timeslot.scalar';

@InputType()
export class CreateUnconfirmedOrderInput implements Partial<Order> {
  @Field()
  @IsISO4217()
  currencyCode: string;

  @Field()
  @IsDate()
  pickupDate: Date;

  @Field((_type) => OrderTimeslotScalar, {
    description: 'The timeslot for pickup',
  })
  pickupBetween: OrderTimeslots;

  @Field()
  @IsDate()
  deliveryDate: Date;

  @Field((_type) => OrderTimeslotScalar, {
    description: 'The timeslot for delivery',
  })
  deliverBetween: OrderTimeslots;

  @Field((_type) => AddOrderAddressInput)
  pickupAddressInput: AddOrderAddressInput;

  @Field((_type) => AddOrderAddressInput)
  deliveryAddressInput: AddOrderAddressInput;

  @Field()
  productVersionId: string;

  @Field()
  @Min(1)
  quantity: number;

  @Field()
  @Min(0)
  totalPriceInCents: number;

  @Field((_type) => [String])
  preferenceIds: string[];

  @Field()
  isExpressDelivery: boolean;
}
