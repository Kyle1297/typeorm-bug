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
import { IsISO31661Alpha2, MaxLength, validateOrReject } from 'class-validator';
import { PolymorphicChildInterface } from 'src/server/common/types/PolymorphicChildInterface';
import {
  AddressInstructionScalar,
  AddressInstructionTypes,
} from './scalars/AddressInstructionScalar';
import { AddressTypes, AddressTypeScalar } from './scalars/AddressTypeScalar';

export interface Addressable {
  addresses: Address[];
  id: string;
}

@ObjectType()
@Entity()
export class Address implements PolymorphicChildInterface {
  @Field((_type) => ID)
  @PrimaryColumn('uuid')
  id: string;

  @Field({ description: 'Place or business name', defaultValue: '' })
  @MaxLength(255)
  @Column({ nullable: false, default: '' })
  organisationName: string;

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

  @Field((_type) => AddressInstructionScalar, {
    description: 'General instructions for delivery and/or pickup',
  })
  @Column({ nullable: false })
  instructions: AddressInstructionTypes;

  @Field({
    description:
      'E.g. leave on porch, call on delivery, security codes on entry, etc.',
    defaultValue: '',
  })
  @Column({ nullable: false, default: '' })
  additionalNotes: string;

  @Field((_type) => AddressTypeScalar, {
    description:
      'Different address types for customers, workers and their businesses',
  })
  @Column({ nullable: false })
  type: AddressTypes;

  @Column('uuid', { nullable: false })
  entityId: string;

  @Column({ nullable: false })
  entityType: string;

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
    this.validateAddressTypeAndInstructions();
    await validateOrReject(this);
  }

  validateAddressTypeAndInstructions() {
    if (this.type === 'BUSINESS' || this.type === 'WASHING') {
      if (this.instructions !== 'NOT_APPLICABLE') {
        throw new Error(
          'Invalid parameter: Business or washing addresses cannot have instructions',
        );
      }
    } else {
      if (this.instructions === 'NOT_APPLICABLE') {
        throw new Error(
          'Invalid parameter: Customer addresses must have instructions',
        );
      }
    }
  }
}
