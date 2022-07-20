import { Column, Entity } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { PolymorphicChildInterface } from 'src/server/common/types/PolymorphicChildInterface';
import { BaseEntity } from 'src/server/common/entities/base.entity';

export interface Priceable {
  prices: Price[];
  id: string;
}

export const priceableTypes = ['Product', 'ProductFeatureOption'] as const;
export type PriceableTypes = typeof priceableTypes[number];

@ObjectType()
@Entity()
export class Price
  extends BaseEntity
  implements PolymorphicChildInterface<PriceableTypes>
{
  @Field()
  @Column({ nullable: false })
  isPerBag: boolean;

  @Field()
  @Column('integer', { nullable: false })
  aud_in_cents: number;

  @Column('uuid', { nullable: false })
  entityId: string;

  @Column({ nullable: false })
  entityType: PriceableTypes;
}
