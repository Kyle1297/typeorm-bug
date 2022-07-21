import { Field, InputType } from '@nestjs/graphql';
import { IsISO31661Alpha2, MaxLength } from 'class-validator';
import { AddressEntity } from '../entities/address.entity';

@InputType()
export class UpdateAddressInput implements Partial<AddressEntity> {
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
}
