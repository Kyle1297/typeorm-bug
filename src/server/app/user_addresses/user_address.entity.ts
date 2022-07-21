import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import {
  AddressInstructionScalar,
  AddressInstructionTypes,
} from '../../common/scalars/address_instruction.scalar';
import { AddressTypes, AddressTypeScalar } from './scalars/address_type.scalar';
import { AddressEntity } from 'src/server/common/entities/address.entity';
import { User } from '../users/user.entity';

@ObjectType()
@Entity()
export class UserAddress extends AddressEntity {
  @Field({ description: 'Place or business name', defaultValue: '' })
  @MaxLength(255)
  @Column({ nullable: false, default: '' })
  organisationName: string;

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
  @Index()
  @Column({ nullable: false })
  type: AddressTypes;

  @Field((_type) => User)
  @ManyToOne((_type) => User, (user) => user.addresses, {
    nullable: false,
  })
  user: User;
}
