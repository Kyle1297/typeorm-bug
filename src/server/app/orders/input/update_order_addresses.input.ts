import { Field, InputType } from '@nestjs/graphql';
import { AddOrderAddressInput } from '../../order_addresses/input/add_order_address.input';

@InputType()
export class UpdateOrderAddressesInput {
  @Field((_type) => AddOrderAddressInput)
  pickupAddressInput: AddOrderAddressInput;

  @Field((_type) => AddOrderAddressInput)
  deliveryAddressInput: AddOrderAddressInput;
}
