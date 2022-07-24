import { BeforeInsert, Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { BaseEntity } from 'src/server/common/entities/base.entity';
import { ProductFeatureOptionPrice } from '../product_feature_option_prices/product_feature_option_price.entity';
import { ProductFeatureOption } from '../product_feature_options/product_feature_option.entity';
import { ColumnEmbeddedOptions } from 'typeorm/decorator/options/ColumnEmbeddedOptions';
import { Order } from '../orders/order.entity';

@ObjectType()
@Entity()
export class ProductFeatureOptionVersion extends BaseEntity {
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

  @Field((_type) => ProductFeatureOption)
  @ManyToOne(
    (_type) => ProductFeatureOption,
    (productFeatureOption) => productFeatureOption.versions,
    {
      nullable: false,
    },
  )
  readonly productFeatureOption: ProductFeatureOption;

  @Field((_type) => ProductFeatureOptionPrice)
  @ManyToOne((_type) => ProductFeatureOptionPrice, { nullable: true })
  readonly price?: ProductFeatureOptionPrice;

  @Field((_type) => [Order])
  @ManyToMany((_type) => Order, (order) => order.preferences, {
    nullable: false,
  })
  orders: Order[];

  @BeforeInsert()
  setVersionNumber() {
    this.versionNumber = this.productFeatureOption.versions.reduce(
      (latestVersionNumber, currentVersion) => {
        const currentVersionNumber = currentVersion.versionNumber;

        return currentVersionNumber > latestVersionNumber
          ? currentVersionNumber
          : latestVersionNumber;
      },
      0,
    );
  }
}
