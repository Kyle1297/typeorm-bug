import { BeforeInsert, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { BaseEntity } from 'src/server/common/entities/base.entity';
import { ProductPrice } from '../product_prices/product_price.entity';
import { Order } from '../orders/order.entity';
import { Product } from '../products/product.entity';
import { ColumnEmbeddedOptions } from 'typeorm/decorator/options/ColumnEmbeddedOptions';

@ObjectType()
@Entity()
export class ProductVersion extends BaseEntity {
  @Field()
  @Min(1)
  @Column(
    'integer' as unknown as (type?: any) => () => any,
    {
      nullable: false,
      update: false,
    } as ColumnEmbeddedOptions,
  )
  versionNumber: number;

  @Field((_type) => Product)
  @ManyToOne((_type) => Product, (product) => product.versions, {
    nullable: false,
  })
  readonly product: Product;

  @Field((_type) => ProductPrice)
  @ManyToOne((_type) => ProductPrice, { nullable: false })
  readonly basePrice: ProductPrice;

  @Field((_type) => ProductPrice)
  @ManyToOne((_type) => ProductPrice, { nullable: false })
  readonly deliveryCost: ProductPrice;

  @Field((_type) => [Order])
  @OneToMany((_type) => Order, (order) => order.productVersion, {
    nullable: false,
  })
  orders: Order[];

  @BeforeInsert()
  setVersionNumber() {
    this.versionNumber = this.product.versions.length + 1;
  }
}
