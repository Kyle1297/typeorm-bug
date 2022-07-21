import { UserAddress } from '../user_address.entity';
import { Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import {
  AddressInstructionScalar,
  AddressInstructionTypes,
} from '../../../common/scalars/address_instruction.scalar';
import {
  AddressTypes,
  AddressTypeScalar,
} from '../scalars/address_type.scalar';
import { AddAddressInput } from 'src/server/common/inputs/add_address.input';

@InputType()
export class AddUserAddressInput
  extends AddAddressInput
  implements Partial<UserAddress>
{
  @Field({
    description: 'Place or business name',
    defaultValue: '',
    nullable: true,
  })
  @MaxLength(255)
  organisationName?: string;

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
