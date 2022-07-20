import { Entity, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { ImageEntity } from 'src/server/common/entities/image.entity';
import { Order } from '../orders/order.entity';

@ObjectType()
@Entity()
export class OrderImage extends ImageEntity {
  @Field((_type) => Order)
  @ManyToOne((_type) => Order, {
    nullable: false,
  })
  order: Order;
}
