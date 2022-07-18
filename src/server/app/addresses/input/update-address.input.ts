import { Address } from '../address.entity';
import { Field, InputType } from '@nestjs/graphql';
import { IsISO31661Alpha2, MaxLength } from 'class-validator';
import {
  AddressInstructionScalar,
  AddressInstructionTypes,
} from '../scalars/AddressInstructionScalar';
import { AddressTypes, AddressTypeScalar } from '../scalars/AddressTypeScalar';

@InputType()
export class UpdateAddressInput implements Partial<Address> {
  @Field({
    description: 'Place or business name',
    nullable: true,
  })
  @MaxLength(255)
  organisationName?: string;

  @Field({ description: 'Street address line 1', nullable: true })
  @MaxLength(255)
  line1?: string;

  @Field({
    description: 'Street address line 2',
    nullable: true,
  })
  @MaxLength(255)
  line2?: string;

  @Field({ description: 'City or town', nullable: true })
  @MaxLength(255)
  locality?: string;

  @Field({ description: 'State, province or region', nullable: true })
  @MaxLength(255)
  administrativeArea?: string;

  @Field({ nullable: true })
  @MaxLength(255)
  postalCode?: string;

  @Field({ nullable: true })
  @IsISO31661Alpha2()
  countryCode?: string;

  @Field((_type) => AddressInstructionScalar, {
    description: 'General instructions for delivery and/or pickup',
    nullable: true,
  })
  instructions?: AddressInstructionTypes;

  @Field({
    description:
      'E.g. leave on porch, call on delivery, security codes on entry, etc.',
    nullable: true,
  })
  additionalNotes?: string;

  @Field((_type) => AddressTypeScalar, {
    description:
      'Different address types for customers, workers and their businesses',
    nullable: true,
  })
  type?: AddressTypes;
}
