import { Column, Entity, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { BaseEntity } from 'src/server/common/entities/base.entity';
import { ProductFeatureOption } from '../product_feature_options/productFeatureOption.entity';

@ObjectType()
@Entity()
export class ProductFeature extends BaseEntity {
  @Field()
  @MaxLength(255)
  @Column({ nullable: false })
  name: string;

  @Field({ defaultValue: '' })
  @MaxLength(1200)
  @Column('text', { nullable: false, default: '' })
  description: string;

  @Field((_type) => [ProductFeatureOption])
  @OneToMany(
    (_type) => ProductFeatureOption,
    (productFeatureOptions) => productFeatureOptions.productFeature,
    {
      nullable: false,
    },
  )
  options: ProductFeatureOption[];
}
