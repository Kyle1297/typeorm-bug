import { UpdateOrderAddressInput } from '../../order_addresses/input/update_order_address.input';
import { UserAddress } from '../../user_addresses/user_address.entity';

export const getOrderAddressInputs = (
  pickupAddress: UserAddress,
  deliveryAddress: UserAddress,
): {
  pickupAddressInput: UpdateOrderAddressInput;
  deliveryAddressInput: UpdateOrderAddressInput;
} => {
  if (!pickupAddress || !deliveryAddress) {
    throw new Error('Pickup and delivery addresses are required');
  }

  const pickupAddressInput = {
    line1: pickupAddress.line1,
    line2: pickupAddress.line2,
    locality: pickupAddress.locality,
    administrativeArea: pickupAddress.administrativeArea,
    postalCode: pickupAddress.postalCode,
    countryCode: pickupAddress.countryCode,
    organisationName: pickupAddress.organisationName,
    instructions: pickupAddress.instructions,
    additionalNotes: pickupAddress.additionalNotes,
  };

  const deliveryAddressInput = {
    line1: deliveryAddress.line1,
    line2: deliveryAddress.line2,
    locality: deliveryAddress.locality,
    administrativeArea: deliveryAddress.administrativeArea,
    postalCode: deliveryAddress.postalCode,
    countryCode: deliveryAddress.countryCode,
    organisationName: deliveryAddress.organisationName,
    instructions: deliveryAddress.instructions,
    additionalNotes: deliveryAddress.additionalNotes,
  };

  return {
    pickupAddressInput,
    deliveryAddressInput,
  };
};
