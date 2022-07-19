import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { BaseEntity } from 'src/server/common/entities/base.entity';
import { ProductFeature } from '../product_features/productFeature.entity';

@ObjectType()
@Entity()
export class ProductFeatureOption extends BaseEntity {
  @Field()
  @MaxLength(255)
  @Column({ nullable: false })
  name: string;

  @Field({ defaultValue: '' })
  @MaxLength(1200)
  @Column('text', { nullable: false, default: '' })
  description: string;

  @Field({ defaultValue: false })
  @Index()
  @Column({ nullable: false, default: false })
  isDefault: boolean;

  @Field((_type) => ProductFeature)
  @ManyToOne(
    (_type) => ProductFeature,
    (productFeature) => productFeature.options,
    {
      nullable: false,
    },
  )
  productFeature: ProductFeature;
}
