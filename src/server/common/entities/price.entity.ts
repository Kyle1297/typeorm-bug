import { Column } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from './base.entity';

@ObjectType()
export abstract class PriceEntity extends BaseEntity {
  @Field()
  @Column({ nullable: false, default: true })
  isPerBag: boolean;

  @Field()
  @Column('integer', { nullable: false })
  audInCents: number;
}
