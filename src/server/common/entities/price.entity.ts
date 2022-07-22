import { Column } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from './base.entity';
import { Min } from 'class-validator';
import { ColumnEmbeddedOptions } from 'typeorm/decorator/options/ColumnEmbeddedOptions';

@ObjectType()
export abstract class PriceEntity extends BaseEntity {
  @Field()
  @Column({ nullable: false, default: true, update: false })
  isPerBag: boolean;

  @Field()
  @Min(0)
  @Column(
    'integer' as unknown as (type?: any) => () => any,
    {
      nullable: false,
      update: false,
    } as ColumnEmbeddedOptions,
  )
  audInCents: number;
}
