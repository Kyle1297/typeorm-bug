import { Field, InputType } from '@nestjs/graphql';
import { IsDate } from 'class-validator';
import { Order } from '../order.entity';
import {
  OrderTimeslots,
  OrderTimeslotScalar,
} from '../scalars/order_timeslot.scalar';

@InputType()
export class UpdateOrderScheduleInput implements Partial<Order> {
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
}
