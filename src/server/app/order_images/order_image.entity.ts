import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { ImageEntity } from 'src/server/common/entities/image.entity';
import { Order } from '../orders/order.entity';
import {
  OrderImageTypes,
  OrderImageTypeScalar,
} from './scalars/order_image_type.scalar';

@ObjectType()
@Entity()
export class OrderImage extends ImageEntity {
  @Field((_type) => Order)
  @ManyToOne((_type) => Order, (order) => order.images, {
    nullable: false,
  })
  order: Order;

  @Field((_type) => OrderImageTypeScalar, {
    description: 'Different types of order images',
  })
  @Column({
    nullable: false,
  })
  type: OrderImageTypes;
}
