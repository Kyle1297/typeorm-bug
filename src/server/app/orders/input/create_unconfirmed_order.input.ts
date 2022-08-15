import { Field, InputType } from '@nestjs/graphql';
import { IsDate, Min } from 'class-validator';
import { Order } from '../order.entity';
import {
  OrderTimeslots,
  OrderTimeslotScalar,
} from '../scalars/order_timeslot.scalar';

@InputType()
export class CreateUnconfirmedOrderInput implements Partial<Order> {
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

  @Field()
  productVersionId: string;

  @Field()
  @Min(1)
  quantity: number;

  @Field((_type) => [String])
  preferenceIds: string[];

  @Field()
  isExpressDelivery: boolean;
}
