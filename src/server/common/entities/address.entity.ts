import { Column } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsISO31661Alpha2, MaxLength } from 'class-validator';
import { BaseEntity } from './base.entity';

@ObjectType()
export abstract class AddressEntity extends BaseEntity {
  @Field({ description: 'Street address line 1' })
  @MaxLength(255)
  @Column({ nullable: false })
  line1: string;

  @Field({ description: 'Street address line 2', defaultValue: '' })
  @MaxLength(255)
  @Column({ nullable: false, default: '' })
  line2: string;

  @Field({ description: 'City or town' })
  @MaxLength(255)
  @Column({ nullable: false })
  locality: string;

  @Field({ description: 'State, province or region' })
  @MaxLength(255)
  @Column({ nullable: false })
  administrativeArea: string;

  @Field()
  @MaxLength(255)
  @Column({ nullable: false })
  postalCode: string;

  @Field()
  @IsISO31661Alpha2()
  @Column({ nullable: false })
  countryCode: string;
}
