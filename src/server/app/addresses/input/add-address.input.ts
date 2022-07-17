import { Address } from '../address.entity';
import { Field, InputType } from '@nestjs/graphql';
import { IsISO31661Alpha2, MaxLength } from 'class-validator';
import {
  AddressInstructionScalar,
  AddressInstructionTypes,
} from '../scalars/AddressInstructionScalar';
import { AddressTypes, AddressTypeScalar } from '../scalars/AddressTypeScalar';

@InputType()
export class AddAddressInput implements Partial<Address> {
  @Field({
    description: 'Place or business name',
    defaultValue: '',
    nullable: true,
  })
  @MaxLength(255)
  organisationName?: string;

  @Field({ description: 'Street address line 1' })
  @MaxLength(255)
  line1: string;

  @Field({
    description: 'Street address line 2',
    defaultValue: '',
    nullable: true,
  })
  @MaxLength(255)
  line2?: string;

  @Field({ description: 'City or town' })
  @MaxLength(255)
  locality: string;

  @Field({ description: 'State, province or region' })
  @MaxLength(255)
  administrativeArea: string;

  @Field()
  @MaxLength(255)
  postalCode: string;

  @Field()
  @IsISO31661Alpha2()
  countryCode: string;

  @Field((_type) => AddressInstructionScalar, {
    description: 'General instructions for delivery and/or pickup',
  })
  instructions: AddressInstructionTypes;

  @Field({
    description:
      'E.g. leave on porch, call on delivery, security codes on entry, etc.',
    defaultValue: '',
  })
  additionalNotes: string;

  @Field((_type) => AddressTypeScalar, {
    description:
      'Different address types for customers, workers and their businesses',
  })
  type: AddressTypes;
}
