import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { ProductImage } from '../product_images/product_image.entity';
import { BaseEntity } from 'src/server/common/entities/base.entity';
import { ProductFeature } from '../product_features/product_feature.entity';
import { ProductVersion } from '../product_versions/product_version.entity';

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

  @Field()
  @Column({ nullable: false, default: true })
  isAvailable: boolean;

  @Field((_type) => ProductImage)
  @OneToOne((_type) => ProductImage)
  @JoinColumn()
  image: ProductImage;

  @Field((_type) => [ProductFeature])
  @ManyToMany(() => ProductFeature)
  @JoinTable()
  features: ProductFeature[];

  @Field((_type) => ProductVersion)
  @OneToMany(
    (_type) => ProductVersion,
    (productVersion) => productVersion.product,
    {
      nullable: false,
    },
  )
  versions: ProductVersion[];

  latestVersion: ProductVersion;
}
