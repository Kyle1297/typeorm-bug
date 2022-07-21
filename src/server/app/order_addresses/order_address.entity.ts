import { Column, Entity } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { AddressEntity } from 'src/server/common/entities/address.entity';
import {
  AddressInstructionScalar,
  AddressInstructionTypes,
} from '../../common/scalars/address_instruction.scalar';

@ObjectType()
@Entity()
export class OrderAddress extends AddressEntity {
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
}
