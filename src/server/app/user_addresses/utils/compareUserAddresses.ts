import { UserAddress } from '../user_address.entity';

export const compareUserAddresses = (
  address1: UserAddress,
  address2: UserAddress,
): boolean => {
  if (!address1 || !address2) {
    throw new Error('One or both addresses are null or undefined');
  }

  return (
    address1.line1 === address2.line1 &&
    address1.line2 === address2.line2 &&
    address1.locality === address2.locality &&
    address1.administrativeArea === address2.administrativeArea &&
    address1.countryCode === address2.countryCode &&
    address1.postalCode === address2.postalCode
  );
};
