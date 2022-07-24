import { Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { UpdateAddressInput } from 'src/server/common/inputs/update_address.input';
import {
  AddressInstructionScalar,
  AddressInstructionTypes,
} from '../../../common/scalars/address_instruction.scalar';
import { OrderAddress } from '../order_address.entity';

@InputType()
export class UpdateOrderAddressInput
  extends UpdateAddressInput
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
