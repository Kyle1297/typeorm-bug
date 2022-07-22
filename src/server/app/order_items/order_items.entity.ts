import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { BaseEntity } from 'src/server/common/entities/base.entity';
import { Order } from '../orders/order.entity';
import { ProductFeatureOptionVersion } from '../product_feature_option_versions/product_feature_option_version.entity';

@ObjectType()
@Entity()
export class OrderItem extends BaseEntity {
  @Field()
  @Column('integer', { nullable: false })
  @Min(1)
  quantity: number;

  @Field()
  @Column('integer', { nullable: false, default: 0 })
  @Min(0)
  totalPriceInCents: number;

  @Field((_type) => Order)
  @ManyToOne((_type) => Order, (order) => order.items, {
    nullable: false,
  })
  order: Order;

  @Field((_type) => [ProductFeatureOptionVersion])
  @ManyToMany(
    () => ProductFeatureOptionVersion,
    (productFeatureOptionVersion) => productFeatureOptionVersion.orderItems,
  )
  @JoinTable()
  selectedProductFeatureOptions: ProductFeatureOptionVersion[];
}
