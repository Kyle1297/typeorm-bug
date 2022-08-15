import { AfterLoad, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { BaseEntity } from 'src/server/common/entities/base.entity';
import { ProductFeature } from '../product_features/product_feature.entity';
import { ProductFeatureOptionVersion } from '../product_feature_option_versions/product_feature_option_version.entity';

@ObjectType()
@Entity()
export class ProductFeatureOption extends BaseEntity {
  @Field()
  @MaxLength(255)
  @Column({ nullable: false, update: false })
  name: string;

  @Field({ defaultValue: '' })
  @MaxLength(1200)
  @Column('text', { nullable: false, default: '' })
  description: string;

  @Field({ defaultValue: false })
  @Column({ nullable: false, default: false })
  isDefault: boolean;

  @Field()
  @Column({ nullable: false, default: true })
  isAvailable: boolean;

  @Field((_type) => ProductFeature)
  @ManyToOne(
    (_type) => ProductFeature,
    (productFeature) => productFeature.options,
    {
      nullable: false,
    },
  )
  productFeature: ProductFeature;

  @Field((_type) => [ProductFeatureOptionVersion])
  @OneToMany(
    (_type) => ProductFeatureOptionVersion,
    (productFeatureOptionVersion) =>
      productFeatureOptionVersion.productFeatureOption,
    {
      nullable: false,
    },
  )
  versions: ProductFeatureOptionVersion[];

  @Field((_type) => ProductFeatureOptionVersion)
  latestVersion: ProductFeatureOptionVersion;

  @AfterLoad()
  fetchLatestVersion() {
    if (this.versions) {
      this.latestVersion = this.versions.reduce(
        (latestVersion, currentVersion) => {
          return currentVersion.versionNumber > latestVersion.versionNumber
            ? currentVersion
            : latestVersion;
        },
        this.versions[0],
      );
    }
  }
}
