import { Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { UpdateAddressInput } from 'src/server/common/inputs/update_address.input';
import {
  AddressInstructionScalar,
  AddressInstructionTypes,
} from '../../../common/scalars/address_instruction.scalar';
import {
  AddressTypes,
  AddressTypeScalar,
} from '../scalars/address_type.scalar';
import { UserAddress } from '../user_address.entity';

@InputType()
export class UpdateUserAddressInput
  extends UpdateAddressInput
  implements Partial<UserAddress>
{
  @Field({
    description: 'Place or business name',
    nullable: true,
  })
  @MaxLength(255)
  organisationName?: string;

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
