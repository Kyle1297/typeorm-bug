import { Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { AddAddressInput } from 'src/server/common/inputs/add_address.input';
import {
  AddressInstructionScalar,
  AddressInstructionTypes,
} from '../../../common/scalars/address_instruction.scalar';
import { OrderAddress } from '../order_address.entity';

@InputType()
export class AddOrderAddressInput
  extends AddAddressInput
  implements Partial<OrderAddress>
{
  @Field({
    description: 'Place or business name',
    defaultValue: '',
  })
  @MaxLength(255)
  organisationName: string;

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
}
