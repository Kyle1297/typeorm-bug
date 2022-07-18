import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import * as uuid from 'uuid-with-v6';
import { validateOrReject } from 'class-validator';
import { PolymorphicChildInterface } from 'src/server/common/types/PolymorphicChildInterface';

export interface Priceable {
  prices: Price[];
  id: string;
}

export const priceableTypes = ['Product', 'ProductFeatureOptions'] as const;
export type PriceableTypes = typeof priceableTypes[number];

@ObjectType()
@Entity()
export class Price implements PolymorphicChildInterface<PriceableTypes> {
  @Field((_type) => ID)
  @PrimaryColumn('uuid')
  id: string;

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

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  setIdAsUuid() {
    this.id = uuid.v6();
  }

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
