import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { Price } from '../prices/price.entity';
import { Image } from '../images/image.entity';
import { BaseEntity } from 'src/server/common/entities/base.entity';
import { ProductFeature } from '../product_features/productFeature.entity';

@ObjectType()
@Entity()
export class Product extends BaseEntity {
  @Field()
  @MaxLength(255)
  @Column({ nullable: false })
  name: string;

  @Field()
  @MaxLength(1200)
  @Column('text', { nullable: false })
  description: string;

  @Field((_type) => Image)
  @OneToOne((_type) => Image)
  @JoinColumn()
  image: Image;

  @Field((_type) => Price)
  @OneToOne((_type) => Price, (price) => price.entityId)
  @JoinColumn()
  price: Price;

  @Field((_type) => [ProductFeature])
  @ManyToMany(() => ProductFeature)
  @JoinTable()
  features: ProductFeature[];
}
